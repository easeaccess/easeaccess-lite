<?php
/**
 * EaseAccess Lite Uninstall
 *
 * Removes every option this plugin creates when the user deletes the plugin
 * from the WordPress admin. WordPress runs this file automatically.
 *
 * @package EaseAccess_Lite
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

$easeaccess_lite_options = array(
	// Install / version metadata.
	'easeaccess_lite_installed',
	'easeaccess_lite_version',

	// Widget / feature / statement settings.
	'zone7_accessibility_features',
	'zone7_accessibility_svg_settings',
	'zone7_accessibility_statement',
);

// Single-site cleanup.
foreach ( $easeaccess_lite_options as $easeaccess_lite_option ) {
	delete_option( $easeaccess_lite_option );
}

// Multisite cleanup.
if ( is_multisite() ) {
	$easeaccess_lite_sites = get_sites( array( 'fields' => 'ids', 'number' => 0 ) );
	foreach ( $easeaccess_lite_sites as $easeaccess_lite_blog_id ) {
		switch_to_blog( $easeaccess_lite_blog_id );
		foreach ( $easeaccess_lite_options as $easeaccess_lite_option ) {
			delete_option( $easeaccess_lite_option );
		}
		restore_current_blog();
	}
}
