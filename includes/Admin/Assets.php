<?php

namespace EaseAccess_Lite\Admin;

defined( 'ABSPATH' ) || exit;

/**
 * EaseAccess Lite — Admin Assets.
 *
 * @package EaseAccess_Lite\Admin
 */
class Assets {

	public function __construct() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
	}

	public function enqueue_admin_assets( $hooks ) {
		if ( 'toplevel_page_easeaccess-lite' !== $hooks ) {
			return;
		}

		$asset_file = EASEACCESS_LITE_PLUGIN_DIR_PATH . 'build/admin.asset.php';
		$asset      = file_exists( $asset_file ) ? include $asset_file : array(
			'dependencies' => array(),
			'version'      => EASEACCESS_LITE_VERSION,
		);

		wp_enqueue_script(
			'easeaccess-lite-admin-script',
			EASEACCESS_LITE_PLUGIN_DIR_URL . 'build/admin.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		if ( function_exists( 'wp_set_script_translations' ) ) {
			wp_set_script_translations(
				'easeaccess-lite-admin-script',
				'easeaccess-lite',
				EASEACCESS_LITE_PLUGIN_DIR_PATH . 'languages'
			);
		}

		wp_enqueue_media();

		$admin_payload = array(
			'nonce'    => wp_create_nonce( 'wp_rest' ),
			'rest_url' => rest_url(),
		);
		wp_localize_script( 'easeaccess-lite-admin-script', 'EaseAccessLiteAdmin', $admin_payload );
	}
}
