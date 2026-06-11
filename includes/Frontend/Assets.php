<?php

namespace EaseAccess_Lite\Frontend;

// Import common WordPress functions into the namespace for static analysis tools

defined( 'ABSPATH' ) || exit;

/**
 * EaseAccess Frontend Assets Class
 *
 * @package EaseAccess\Frontend\Assets
 * @since 0.0.1
 */
class Assets {
    /**
     * Constructor
     */
    public function __construct() {
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
        add_action( 'wp_loaded', array( $this, 'register_nav_widget_hook' ) );
    }

    /**
     * Register nav widget hook — runs at wp_loaded when theme is fully available.
     */
    public function register_nav_widget_hook() {
        if ( $this->is_divi_theme() ) {
            add_action( 'wp_footer', array( $this, 'inject_divi_nav_widget' ), 5 );
        } else {
            add_filter( 'wp_nav_menu_objects', array( $this, 'add_nav_widget_item' ), 10, 2 );
        }
    }

    /**
     * Check if active theme is Divi or a Divi child theme.
     */
    private function is_divi_theme() {
        $theme_name = wp_get_theme()->get( 'Name' );
        $template   = get_template();
        if ( 'Divi' === $theme_name || 'Divi' === $template ) {
            return true;
        }
        $parent = wp_get_theme()->parent();
        if ( $parent && 'Divi' === $parent->get( 'Name' ) ) {
            return true;
        }
        return false;
    }
    /**
     * Enqueue frontend assets
     *
     * @return void
     */
    public function enqueue_frontend_assets() {
        // Fetch saved svg/widget settings to determine if widget is enabled and display constraints
        $svg_settings = get_option( 'zone7_accessibility_svg_settings', [] );
        $enabled = true; // default to on if not explicitly disabled
        if ( is_array( $svg_settings ) && array_key_exists( 'enableWidget', $svg_settings ) ) {
            $enabled = (bool) $svg_settings['enableWidget'];
        }

        if ( !$enabled ) {
            return; // globally disabled
        }

        // Detect common page builder editing contexts and skip enqueue there.
        if ( $this->is_builder_request() ) {
            return;
        }

        // Display mode logic: all | include | exclude
        $display_mode = isset( $svg_settings['displayMode'] ) ? $svg_settings['displayMode'] : 'all';
        $include_posttypes = isset( $svg_settings['includePostTypes'] ) && is_array( $svg_settings['includePostTypes'] ) ? $svg_settings['includePostTypes'] : [];
        $exclude_posttypes = isset( $svg_settings['excludePostTypes'] ) && is_array( $svg_settings['excludePostTypes'] ) ? $svg_settings['excludePostTypes'] : [];

        // Build context tags without mapping home to 'post'.
        $context_tags = [];

        if ( \is_singular() ) {
            $ptype = \get_post_type();
            if ( $ptype ) {
                $context_tags[] = $ptype; // 'post', 'page', 'product', etc.
            }
        }

        // Front page (could be static or latest posts). We treat it as 'page' to satisfy expectation that selecting 'page' shows root.
        if ( \is_front_page() ) {
            $context_tags[] = 'front_page';
            if ( !in_array( 'page', $context_tags, true ) ) {
                $context_tags[] = 'page';
            }
        }

        // Blog posts index (might also be front page). Provide separate token so we don't force include when only 'post' selected.
        if ( \is_home() ) {
            $context_tags[] = 'home';
        }

        if ( empty( $context_tags ) ) {
            // Generic fallback for non-singular non-home contexts (archives, search, etc.)
            $context_tags[] = 'page';
        }

        $should_load = true;
        if ( $display_mode === 'include' ) {
            // Intersect include list with context tags.
            $should_load = (bool) array_intersect( $include_posttypes, $context_tags );
        } elseif ( $display_mode === 'exclude' ) {
            if ( array_intersect( $exclude_posttypes, $context_tags ) ) {
                $should_load = false;
            }
        }

        if ( !$should_load ) {
            return; // do not enqueue on this request
        }
        $frontend_path = EASEACCESS_LITE_PLUGIN_DIR_PATH . 'build/frontend.js';
        $frontend_ver  = file_exists( $frontend_path ) ? filemtime( $frontend_path ) : EASEACCESS_LITE_VERSION;

        \wp_enqueue_script(
            'easeaccess-lite-frontend',
            EASEACCESS_LITE_PLUGIN_DIR_URL . 'build/frontend.js',
            [],
            $frontend_ver,
            true
        );

        // Load translations for @wordpress/i18n strings used in the bundle.
        // Requires .json JED files in /languages (generated via `wp i18n make-json`).
        if ( function_exists( 'wp_set_script_translations' ) ) {
            \wp_set_script_translations(
                'easeaccess-lite-frontend',
                'easeaccess-lite',
                EASEACCESS_LITE_PLUGIN_DIR_PATH . 'languages'
            );
        }

        // Register an empty style handle so we have something to attach the
        // anti-flicker inline CSS to. (The frontend bundle injects its own
        // styles via JS, so there is no real stylesheet file to enqueue.)
        \wp_register_style( 'easeaccess-lite-frontend-style', false, [], $frontend_ver );
        \wp_enqueue_style( 'easeaccess-lite-frontend-style' );

        // Add inline CSS to prevent button position flicker on live sites
        $anti_flicker_css = '
        #accessibility-widget:not(.accessibility-widget-ready) > div {
            opacity: 0;
            visibility: hidden;
        }
        .accessibility-widget-ready > div {
            opacity: 1;
            visibility: visible;
            transition: opacity 0.1s ease-in;
        }
        ';
        \wp_add_inline_style( 'easeaccess-lite-frontend-style', $anti_flicker_css );

        // Pass REST API root URL and AJAX URL so the bundled scripts work correctly.
        $settings_payload = [
            'api_url'          => '/wp-json/easeaccess-lite/v1/widget-settings',
            'rest_url'         => \rest_url(),
            'ajax_url'         => \admin_url( 'admin-ajax.php' ),
            'default_language' => isset( $svg_settings['defaultLanguage'] ) ? $svg_settings['defaultLanguage'] : 'en_US',
            'nonce'            => \wp_create_nonce( 'wp_rest' ),
        ];
        \wp_localize_script( 'easeaccess-lite-frontend', 'EaseAccessLiteSettings', $settings_payload );
    }

    /**
     * Determine if current request is a visual page builder editing session.
     * Supports Elementor, Divi, Beaver Builder, Oxygen, Bricks. Filterable.
     *
     * @return bool
     */
    private function is_builder_request() {
                     // Query param indicators (front-end editors)
        $qs = $_GET; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only context
        $maybe = false;
        // Elementor front-end/editor preview
        if ( isset( $qs['elementor-preview'] ) || isset( $qs['elementor_library'] ) ) {
            $maybe = true;
        }
        // Divi visual builder
        if ( isset( $qs['et_fb'] ) && '1' === $qs['et_fb'] ) {
    // If we're in the iframe, the referrer contains et_fb=1 from the parent.
    $referer = isset( $_SERVER['HTTP_REFERER'] ) ? esc_url_raw(wp_unslash(  $_SERVER['HTTP_REFERER'] )) : '';
    if ( $referer && strpos( $referer, 'et_fb=1' ) !== false ) {
        $maybe = false; // inside iframe → allow load
    } else {
        $maybe = true; // parent shell → skip load
    }
}
        // Beaver Builder
        if ( isset( $qs['fl_builder'] ) ) {
            $maybe = true;
        }
        // Oxygen builder
        if ( isset( $qs['ct_builder'] ) || isset( $qs['oxygen_iframe'] ) ) {
            $maybe = true;
        }
        // Bricks builder
        if ( isset( $qs['bricks'] ) && 'run' === $qs['bricks'] ) {
            $maybe = true;
        }

        // Admin side editors (Elementor backend, etc.)
        if ( \is_admin() ) {
            $screen = \function_exists( 'get_current_screen' ) ? \get_current_screen() : null;
            if ( $screen && isset( $screen->id ) ) {
                // Elementor library / templates
                if ( strpos( $screen->id, 'elementor' ) !== false ) {
                    $maybe = true;
                }
            }
        }

        // Allow 3rd parties to modify.
        return (bool) \apply_filters( 'easeaccess_is_builder_request', $maybe );
    }

    /**
     * Inject widget mount point into Divi's #et-top-navigation (beside #et_top_search).
     * The JS runs as an attached inline script of our already-enqueued frontend
     * bundle — no raw <script> output in templates, per WordPress.org guidelines.
     */
    public function inject_divi_nav_widget() {
        $svg_settings = get_option( 'zone7_accessibility_svg_settings', [] );

        if ( ! isset( $svg_settings['navMode'] ) || ! $svg_settings['navMode'] ||
             ! isset( $svg_settings['enableWidget'] ) || ! $svg_settings['enableWidget'] ) {
            return;
        }

        if ( $this->is_builder_request() ) {
            return;
        }

        $js = '(function(){'
            . "var nav=document.getElementById('et-top-navigation');"
            . "if(!nav||document.getElementById('accessibility-widget-nav'))return;"
            . "var mount=document.createElement('div');"
            . "mount.id='accessibility-widget-nav';"
            . "mount.style.cssText='order:4;transform:translateY(-19px);margin-inline-start:20px;';"
            . "var search=document.getElementById('et_top_search');"
            . "if(search&&search.nextSibling){nav.insertBefore(mount,search.nextSibling);}"
            . 'else{nav.appendChild(mount);}'
            . '})();';

        // Attach the inline JS to our already-enqueued frontend handle.
        \wp_add_inline_script( 'easeaccess-lite-frontend', $js, 'before' );
    }

    /**
     * Add accessibility widget as a menu item (non-Divi themes).
     *
     * @param array $items
     * @param object $args
     * @return array
     */
    public function add_nav_widget_item( $items, $args ) {
        $svg_settings = get_option( 'zone7_accessibility_svg_settings', [] );
        
        // Check if nav mode is enabled and widget is enabled
        if ( !isset( $svg_settings['navMode'] ) || !$svg_settings['navMode'] || 
             !isset( $svg_settings['enableWidget'] ) || !$svg_settings['enableWidget'] ) {
            return $items;
        }

        // Skip if in builder context
        if ( $this->is_builder_request() ) {
            return $items;
        }

        // Create a proper menu item object for the accessibility widget
        $widget_menu_item = new \stdClass();
        $widget_menu_item->ID = 999999; // Unique ID
        $widget_menu_item->db_id = 999999;
        $widget_menu_item->menu_item_parent = 0;
        $widget_menu_item->object_id = 999999;
        $widget_menu_item->post_parent = 0;
        $widget_menu_item->type = 'custom';
        $widget_menu_item->object = 'custom';
        $widget_menu_item->type_label = 'Custom Link';
        $widget_menu_item->title = '<div id="accessibility-widget-nav"></div>';
        $widget_menu_item->url = '#';
        $widget_menu_item->target = '';
        $widget_menu_item->attr_title = '';
        $widget_menu_item->description = '';
        $widget_menu_item->classes = array( 'accessibility-nav-widget' );
        $widget_menu_item->xfn = '';
        
        // Add missing properties that WordPress expects
        $widget_menu_item->current = false;
        $widget_menu_item->current_item_ancestor = false;
        $widget_menu_item->current_item_parent = false;
        $widget_menu_item->menu_order = 999;

        // Add the widget item to the end of the menu
        $items[] = $widget_menu_item;

        return $items;
    }
}
