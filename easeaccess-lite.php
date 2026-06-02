<?php
/*
Plugin Name:       EaseAccess Lite
Plugin URI:        https://wordpress.org/plugins/easeaccess-lite/
Description:       Free Accessibility Widget for WordPress. Adds text adjustments, contrast modes, reading guides, dictionary lookup, big cursor and an accessibility statement generator to your site.
Version:           1.0.0
Requires at least: 5.0
Requires PHP:      7.4
Author:            EaseAccess
Author URI:        https://easeaccess.io/
License:           GPLv2 or later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
Text Domain:       easeaccess-lite
Domain Path:       /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'EASEACCESS_LITE_VERSION' ) ) {
	define( 'EASEACCESS_LITE_VERSION', '1.0.0' );
}
if ( ! defined( 'EASEACCESS_LITE_FILE' ) ) {
	define( 'EASEACCESS_LITE_FILE', __FILE__ );
}
if ( ! defined( 'EASEACCESS_LITE_PLUGIN_DIR_URL' ) ) {
	define( 'EASEACCESS_LITE_PLUGIN_DIR_URL', plugin_dir_url( __FILE__ ) );
}
if ( ! defined( 'EASEACCESS_LITE_PLUGIN_DIR_PATH' ) ) {
	define( 'EASEACCESS_LITE_PLUGIN_DIR_PATH', plugin_dir_path( __FILE__ ) );
}

final class EaseAccess_Lite {

	private static $instance;

	private function __construct() {
		register_activation_hook( __FILE__, array( $this, 'activate' ) );
		add_action( 'plugins_loaded', array( $this, 'init_plugin' ) );
	}

	public static function instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function init_plugin() {
		// WordPress auto-loads translations for .org-hosted plugins since 4.6.

		require_once __DIR__ . '/includes/Frontend/Assets.php';
		require_once __DIR__ . '/includes/API/Library.php';

		if ( is_admin() ) {
			require_once __DIR__ . '/includes/admin.php';
			require_once __DIR__ . '/includes/Admin/Assets.php';

			new \EaseAccess_Lite\Admin\Admin();
			new \EaseAccess_Lite\Admin\Assets();
		}

		new \EaseAccess_Lite\Frontend\Assets();
		new \EaseAccess_Lite\API\Library();
	}

	public function activate() {
		$installed = get_option( 'easeaccess_lite_installed' );
		if ( ! $installed ) {
			update_option( 'easeaccess_lite_installed', time() );
		}
		update_option( 'easeaccess_lite_version', EASEACCESS_LITE_VERSION );
	}
}

function easeaccess_lite() {
	return EaseAccess_Lite::instance();
}

easeaccess_lite();
