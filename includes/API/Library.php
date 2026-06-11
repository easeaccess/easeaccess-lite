<?php

namespace EaseAccess_Lite\API;

defined( 'ABSPATH' ) || exit;

/**
 * EaseAccess Lite — REST API Library.
 *
 * Lite ships only the front-end widget + accessibility statement generator.
 * The AI scan / fix endpoints, server-side auto-fix engine, multi-language
 * page translation, and license endpoints live in the Pro plugin and are
 * NOT included here.
 *
 * @package EaseAccess_Lite\API
 */
class Library {

	const NAMESPACE = 'easeaccess-lite/v1';

	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Per-IP transient-based rate limiter — used so the public Dictionary
	 * proxy can't be abused as an open relay.
	 */
	private function check_rate_limit( $bucket, $max = 30, $window = 60 ) {
		$ip = '';
		if ( ! empty( $_SERVER['REMOTE_ADDR'] ) ) {
			$ip = sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) );
		}
		if ( '' === $ip ) {
			return true;
		}
		$key   = 'easeaccess_lite_rl_' . $bucket . '_' . md5( $ip );
		$count = (int) get_transient( $key );
		if ( $count >= $max ) {
			return false;
		}
		set_transient( $key, $count + 1, $window );
		return true;
	}

	/**
	 * Recursively sanitize a nested array of plugin settings.
	 */
	private function sanitize_deep( $data ) {
		if ( is_array( $data ) ) {
			return array_map( array( $this, 'sanitize_deep' ), $data );
		}
		if ( is_bool( $data ) || is_int( $data ) || is_float( $data ) ) {
			return $data;
		}
		if ( is_string( $data ) ) {
			return sanitize_text_field( $data );
		}
		return $data;
	}

	public function register_routes() {

		// ─────────────────────────────────────────────────────────────────
		// Settings (widget config) — admin read/write.
		// ─────────────────────────────────────────────────────────────────
		register_rest_route( self::NAMESPACE, '/settings', array(
			'methods'             => array( 'GET', 'POST' ),
			'callback'            => array( $this, 'handle_settings' ),
			'permission_callback' => function () {
				return current_user_can( 'manage_options' );
			},
		) );

		// ─────────────────────────────────────────────────────────────────
		// Widget-settings — public, read-only, used by the front-end widget.
		// ─────────────────────────────────────────────────────────────────
		register_rest_route( self::NAMESPACE, '/widget-settings', array(
			'methods'             => 'GET',
			'callback'            => array( $this, 'get_widget_settings' ),
			'permission_callback' => '__return_true',
		) );

		// ─────────────────────────────────────────────────────────────────
		// Accessibility Statement generator — editor read/write/delete.
		// ─────────────────────────────────────────────────────────────────
		register_rest_route( self::NAMESPACE, '/statement', array(
			'methods'             => array( 'GET', 'POST', 'DELETE' ),
			'callback'            => array( $this, 'handle_statement' ),
			'permission_callback' => array( $this, 'statement_permission_check' ),
		) );

		register_rest_route( self::NAMESPACE, '/statement/download', array(
			'methods'             => 'POST',
			'callback'            => array( $this, 'download_statement' ),
			'permission_callback' => function () {
				if ( ! current_user_can( 'edit_pages' ) ) {
					return false;
				}
				$nonce = isset( $_SERVER['HTTP_X_WP_NONCE'] )
					? sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_WP_NONCE'] ) )
					: '';
				return (bool) wp_verify_nonce( $nonce, 'wp_rest' );
			},
		) );

		// ─────────────────────────────────────────────────────────────────
		// Pages list — used by the statement page picker.
		// ─────────────────────────────────────────────────────────────────
		register_rest_route( self::NAMESPACE, '/pages', array(
			'methods'             => 'GET',
			'callback'            => array( $this, 'get_pages' ),
			'permission_callback' => function () {
				return current_user_can( 'edit_pages' );
			},
		) );

		// ─────────────────────────────────────────────────────────────────
		// Dictionary proxy — only called when a visitor explicitly clicks
		// the dictionary feature in the widget.
		// ─────────────────────────────────────────────────────────────────
		register_rest_route( self::NAMESPACE, '/dictionary/(?P<word>[a-zA-Z]+)', array(
			'methods'             => 'GET',
			'callback'            => array( $this, 'get_dictionary_definition' ),
			'permission_callback' => '__return_true',
			'args'                => array(
				'word' => array(
					'required'          => true,
					'validate_callback' => function ( $param ) {
						return is_string( $param ) && '' !== trim( $param );
					},
					'sanitize_callback' => 'sanitize_text_field',
				),
			),
		) );
	}

	/* ============================================================ */
	/* Settings                                                      */
	/* ============================================================ */

	public function handle_settings( $request ) {
		if ( $request->get_method() === 'POST' ) {
			if ( ! wp_verify_nonce( $request->get_header( 'X-WP-Nonce' ), 'wp_rest' ) ) {
				return new \WP_Error( 'rest_cookie_invalid_nonce', 'Cookie nonce is invalid', array( 'status' => 403 ) );
			}

			$params            = $request->get_json_params();
			$features          = isset( $params['features'] ) && is_array( $params['features'] ) ? $params['features'] : array();
			$svg_settings      = isset( $params['svgSettings'] ) && is_array( $params['svgSettings'] ) ? $params['svgSettings'] : array();
			$statement_settings = isset( $params['statementSettings'] ) && is_array( $params['statementSettings'] ) ? $params['statementSettings'] : array();

			$old      = get_option( 'zone7_accessibility_svg_settings', array() );
			$old_exact = isset( $old['exactPosition'] ) ? $old['exactPosition'] : array();

			if ( isset( $svg_settings['exactPosition'] ) ) {
				$exact = $svg_settings['exactPosition'];
				if ( empty( $exact['enabled'] ) ) {
					$svg_settings['exactPosition']['horizontalOffset']    = $old_exact['horizontalOffset'] ?? 0;
					$svg_settings['exactPosition']['verticalOffset']      = $old_exact['verticalOffset'] ?? 0;
					$svg_settings['exactPosition']['horizontalDirection'] = $old_exact['horizontalDirection'] ?? 'left';
					$svg_settings['exactPosition']['verticalDirection']   = $old_exact['verticalDirection'] ?? 'lower';
				} else {
					$svg_settings['exactPosition']['horizontalOffset'] = isset( $exact['horizontalOffset'] ) ? (int) $exact['horizontalOffset'] : 0;
					$svg_settings['exactPosition']['verticalOffset']   = isset( $exact['verticalOffset'] ) ? (int) $exact['verticalOffset'] : 0;

					$svg_settings['exactPosition']['horizontalDirection'] = in_array( $exact['horizontalDirection'] ?? '', array( 'left', 'right' ), true )
						? $exact['horizontalDirection']
						: 'left';
					$svg_settings['exactPosition']['verticalDirection']   = in_array( $exact['verticalDirection'] ?? '', array( 'higher', 'lower' ), true )
						? $exact['verticalDirection']
						: 'lower';
				}
			}

			update_option( 'zone7_accessibility_features', $this->sanitize_deep( $features ) );
			update_option( 'zone7_accessibility_svg_settings', $this->sanitize_deep( $svg_settings ) );

			if ( ! empty( $statement_settings ) ) {
				update_option( 'zone7_accessibility_statement', $this->sanitize_deep( $statement_settings ) );
			}

			return rest_ensure_response( array( 'success' => true ) );
		}

		$features            = get_option( 'zone7_accessibility_features', array() );
		$svg_settings        = get_option( 'zone7_accessibility_svg_settings', array() );
		$statement_settings  = get_option( 'zone7_accessibility_statement', array() );

		if ( ! empty( $statement_settings ) && isset( $statement_settings['page_id'] ) ) {
			$page = get_post( $statement_settings['page_id'] );
			if ( $page && 'publish' === $page->post_status ) {
				$statement_settings['page_url'] = get_permalink( $statement_settings['page_id'] );
			} else {
				delete_option( 'zone7_accessibility_statement' );
				$statement_settings = array();
			}
		}

		return rest_ensure_response( array(
			'features'          => $features,
			'svgSettings'       => $svg_settings,
			'statementSettings' => $statement_settings,
		) );
	}

	public function get_widget_settings( $request ) {
		$features           = get_option( 'zone7_accessibility_features', array() );
		$svg_settings       = get_option( 'zone7_accessibility_svg_settings', array() );
		$statement_settings = get_option( 'zone7_accessibility_statement', array() );

		if ( ! empty( $statement_settings ) && isset( $statement_settings['page_id'] ) ) {
			$page = get_post( $statement_settings['page_id'] );
			if ( $page && 'publish' === $page->post_status ) {
				$statement_settings['page_url'] = get_permalink( $statement_settings['page_id'] );
			}
		}

		return rest_ensure_response( array(
			'features'          => $features,
			'svgSettings'       => $svg_settings,
			'statementSettings' => array(
				'widget_enabled' => $statement_settings['widget_enabled'] ?? false,
				'link_text'      => $statement_settings['link_text'] ?? 'Statement',
				'page_url'       => $statement_settings['page_url'] ?? '',
			),
		) );
	}

	/* ============================================================ */
	/* Statement                                                     */
	/* ============================================================ */

	/**
	 * Capability check for the /statement endpoint.
	 *
	 * GET only reads, but POST publishes a page and DELETE permanently
	 * removes a published page, so each method requires the matching
	 * publish/delete capability rather than a blanket edit_pages check.
	 */
	public function statement_permission_check( $request ) {
		switch ( $request->get_method() ) {
			case 'POST':
				return current_user_can( 'publish_pages' );
			case 'DELETE':
				return current_user_can( 'delete_published_pages' );
			default:
				return current_user_can( 'edit_pages' );
		}
	}

	public function handle_statement( $request ) {
		if ( in_array( $request->get_method(), array( 'POST', 'DELETE' ), true ) ) {
			if ( ! wp_verify_nonce( $request->get_header( 'X-WP-Nonce' ), 'wp_rest' ) ) {
				return new \WP_Error( 'rest_cookie_invalid_nonce', 'Cookie nonce is invalid', array( 'status' => 403 ) );
			}
		}

		if ( $request->get_method() === 'POST' ) {
			return $this->create_statement( $request );
		}
		if ( $request->get_method() === 'DELETE' ) {
			return $this->delete_statement();
		}
		return $this->get_statement();
	}

	private function create_statement( $request ) {
		$params              = $request->get_json_params();
		$company_name        = sanitize_text_field( $params['companyName'] ?? '' );
		$website_url         = esc_url_raw( $params['websiteUrl'] ?? '' );
		$business_email      = sanitize_email( $params['businessEmail'] ?? '' );
		$address             = sanitize_text_field( $params['address'] ?? '' );
		$phone_number        = sanitize_text_field( $params['phoneNumber'] ?? '' );
		$generation_date     = sanitize_text_field( $params['generationDate'] ?? '' );
		$conformance_level   = in_array( $params['conformanceLevel'] ?? '', array( 'non', 'partial', 'full' ), true ) ? $params['conformanceLevel'] : 'partial';
		$known_limitations   = sanitize_textarea_field( $params['knownLimitations'] ?? '' );
		$remediation_timeline = sanitize_text_field( $params['remediationTimeline'] ?? '' );
		$assessment_method   = sanitize_text_field( $params['assessmentMethod'] ?? '' );

		if ( empty( $company_name ) || empty( $website_url ) || empty( $business_email ) ) {
			return new \WP_Error( 'missing_fields', 'Required fields missing', array( 'status' => 400 ) );
		}

		$content = $this->generate_statement_content(
			$company_name, $website_url, $business_email, $address, $phone_number,
			$generation_date, $conformance_level, $known_limitations, $remediation_timeline, $assessment_method
		);

		$page_id = wp_insert_post( array(
			'post_title'   => 'Accessibility Statement',
			'post_content' => $content,
			'post_status'  => 'publish',
			'post_type'    => 'page',
			'post_author'  => get_current_user_id(),
		) );

		if ( is_wp_error( $page_id ) ) {
			return new \WP_Error( 'page_creation_failed', 'Failed to create page', array( 'status' => 500 ) );
		}

		$settings = array(
			'page_id'              => $page_id,
			'company_name'         => $company_name,
			'website_url'          => $website_url,
			'business_email'       => $business_email,
			'address'              => $address,
			'phone_number'         => $phone_number,
			'generation_date'      => $generation_date,
			'conformance_level'    => $conformance_level,
			'known_limitations'    => $known_limitations,
			'remediation_timeline' => $remediation_timeline,
			'assessment_method'    => $assessment_method,
			'created_at'           => current_time( 'mysql' ),
			'link_text'            => 'Statement',
			'widget_enabled'       => true,
		);

		update_option( 'zone7_accessibility_statement', $settings );

		return rest_ensure_response( array(
			'success'            => true,
			'page_id'            => $page_id,
			'page_url'           => get_permalink( $page_id ),
			'statement_settings' => $settings,
		) );
	}

	private function get_statement() {
		$settings = get_option( 'zone7_accessibility_statement', array() );
		if ( empty( $settings ) ) {
			return rest_ensure_response( array( 'exists' => false, 'statement_settings' => array() ) );
		}
		if ( isset( $settings['page_id'] ) ) {
			$page = get_post( $settings['page_id'] );
			if ( ! $page || 'publish' !== $page->post_status ) {
				delete_option( 'zone7_accessibility_statement' );
				return rest_ensure_response( array( 'exists' => false, 'statement_settings' => array() ) );
			}
			$settings['page_url'] = get_permalink( $settings['page_id'] );
		}
		return rest_ensure_response( array( 'exists' => true, 'statement_settings' => $settings ) );
	}

	private function delete_statement() {
		$settings = get_option( 'zone7_accessibility_statement', array() );
		if ( isset( $settings['page_id'] ) ) {
			wp_delete_post( $settings['page_id'], true );
		}
		delete_option( 'zone7_accessibility_statement' );
		return rest_ensure_response( array( 'success' => true ) );
	}

	public function download_statement( $request ) {
		$params   = $request->get_json_params();
		$format   = $params['format'] ?? 'html';
		$settings = get_option( 'zone7_accessibility_statement', array() );

		if ( empty( $settings ) ) {
			return new \WP_Error( 'no_statement', 'No accessibility statement found', array( 'status' => 404 ) );
		}

		$content = $this->generate_statement_content(
			$settings['company_name'],
			$settings['website_url'],
			$settings['business_email'],
			$settings['address'] ?? '',
			$settings['phone_number'] ?? '',
			$settings['generation_date'] ?? '',
			$settings['conformance_level'] ?? 'partial',
			$settings['known_limitations'] ?? '',
			$settings['remediation_timeline'] ?? '',
			$settings['assessment_method'] ?? ''
		);

		return rest_ensure_response( array(
			'content'   => $content,
			'filename'  => 'html' === $format ? 'accessibility-statement.html' : 'accessibility-statement.pdf',
			'mime_type' => 'html' === $format ? 'text/html' : 'application/pdf',
		) );
	}

	private function generate_statement_content( $company, $url, $email, $address = '', $phone = '', $date = '', $conformance = 'partial', $limits = '', $timeline = '', $assessment = '' ) {
		$date_str = $date ? gmdate( 'F j, Y', strtotime( $date ) ) : gmdate( 'F j, Y' );
		$company  = esc_html( $company );
		$url      = esc_html( $url );
		$email    = esc_html( $email );
		$address  = esc_html( $address );
		$phone    = esc_html( $phone );
		$date_str = esc_html( $date_str );

		switch ( $conformance ) {
			case 'full':
				$label    = 'fully conforms';
				$sentence = "The website {$url} is <strong>fully conformant</strong> with WCAG 2.2 level AA. Fully conformant means that the content fully meets the accessibility standard without any exceptions.";
				break;
			case 'non':
				$label    = 'does not conform';
				$sentence = "The website {$url} is <strong>non-conformant</strong> with WCAG 2.2 level AA. Non-conformant means that the content does not meet the accessibility standard.";
				break;
			default:
				$label    = 'partially conforms';
				$sentence = "The website {$url} is <strong>partially conformant</strong> with WCAG 2.2 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.";
				break;
		}

		$assessment_label = $assessment ? esc_html( $assessment ) : 'self-evaluation, including automated testing tools and manual review of key pages';

		$content  = "<h3>Accessibility Statement for {$url}</h3>";
		$content .= "<h4>Commitment to Accessibility</h4>";
		$content .= "<p>{$company} is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and applying the relevant accessibility standards.</p>";
		$content .= "<h4>Conformance Status</h4>";
		$content .= "<p>The <a href=\"https://www.w3.org/WAI/standards-guidelines/wcag/\" rel=\"noopener\">Web Content Accessibility Guidelines (WCAG)</a> defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.</p>";
		$content .= "<p>{$sentence}</p>";

		if ( 'full' !== $conformance ) {
			$content .= "<h4>Known Limitations and Alternatives</h4>";
			$content .= "<p>Despite our best efforts to ensure accessibility of {$url}, there may be some limitations. Below is a description of known limitations. Please contact us if you observe an issue not listed below.</p>";

			if ( $limits ) {
				$items = '';
				foreach ( preg_split( '/\r\n|\r|\n/', $limits ) as $line ) {
					$line = trim( $line );
					if ( '' === $line ) {
						continue;
					}
					$items .= '<li>' . esc_html( $line ) . '</li>';
				}
				if ( $items ) {
					$content .= "<ul>{$items}</ul>";
				}
			} else {
				$content .= "<ul><li>Some older video or audio files may not include captions or transcripts.</li><li>Certain third-party plugins, embeds, or user-generated content may not fully meet WCAG 2.2 AA requirements.</li><li>Some PDF documents published before this statement was issued may not be fully tagged for assistive technologies.</li></ul>";
			}

			if ( $timeline ) {
				$content .= '<p><strong>Remediation timeline:</strong> ' . esc_html( $timeline ) . '</p>';
			}
		}

		$content .= "<h4>Assessment Approach</h4>";
		$content .= "<p>{$company} assessed the accessibility of {$url} by the following approach: {$assessment_label}. Automated tools cannot detect every accessibility issue, so we combine them with manual review and user feedback.</p>";
		$content .= "<h4>Feedback</h4>";
		$content .= "<p>We welcome your feedback on the accessibility of {$url}. Please let us know if you encounter accessibility barriers:</p>";
		$content .= "<p>Email: {$email}</p>";
		if ( $phone ) {
			$content .= "<p>Phone: {$phone}</p>";
		}
		if ( $address ) {
			$content .= "<p>Address: {$address}</p>";
		}
		$content .= "<p>We try to respond to feedback within 3–5 business days.</p>";
		$content .= "<h4>Date</h4>";
		$content .= "<p>This statement was created on {$date_str} using the EaseAccess Lite accessibility tooling. The site {$label} with WCAG 2.2 level AA at the time of writing.</p>";

		return $content;
	}

	/* ============================================================ */
	/* Pages list                                                    */
	/* ============================================================ */

	public function get_pages() {
		$pages = get_pages( array( 'post_status' => 'publish', 'number' => 100 ) );
		$out   = array();
		foreach ( $pages as $page ) {
			$out[] = array(
				'id'    => $page->ID,
				'title' => $page->post_title,
				'url'   => get_permalink( $page->ID ),
				'slug'  => $page->post_name,
			);
		}
		return rest_ensure_response( $out );
	}

	/* ============================================================ */
	/* Dictionary proxy                                              */
	/* ============================================================ */

	public function get_dictionary_definition( $request ) {
		$word = $request->get_param( 'word' );
		if ( ! $word ) {
			return rest_ensure_response( array( 'error' => 'Word parameter is required' ) );
		}
		if ( ! $this->check_rate_limit( 'dict', 30, 60 ) ) {
			return new \WP_Error( 'rest_too_many_requests', 'Too many requests', array( 'status' => 429 ) );
		}

		$response = wp_remote_get(
			'https://api.dictionaryapi.dev/api/v2/entries/en/' . rawurlencode( strtolower( $word ) ),
			array(
				'timeout' => 15,
				'headers' => array( 'User-Agent' => 'EaseAccess-Lite/1.0' ),
			)
		);

		if ( is_wp_error( $response ) ) {
			return rest_ensure_response( array( 'error' => 'Unable to fetch definition. Please check your internet connection.' ) );
		}

		$code = wp_remote_retrieve_response_code( $response );
		$body = wp_remote_retrieve_body( $response );

		if ( 200 !== $code ) {
			return rest_ensure_response( array( 'error' => "No definition found for \"{$word}\"." ) );
		}

		$data = json_decode( $body, true );
		if ( JSON_ERROR_NONE !== json_last_error() ) {
			return rest_ensure_response( array( 'error' => 'Failed to parse response from dictionary service.' ) );
		}

		return rest_ensure_response( $data );
	}
}
