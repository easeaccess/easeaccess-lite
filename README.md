# EaseAccess Lite

Free accessibility widget for WordPress — text resize, contrast modes, reading guides, big cursor, dictionary lookup, and an accessibility statement generator.

This is the open-source repository for **EaseAccess Lite**, the free edition published on WordPress.org.

A separate **EaseAccess Pro** edition with AI-powered accessibility fixes, automated scanning, multi-language page translation and priority support is available at [easeaccess.io](https://easeaccess.io/) — it is distributed under its own licensing and is not part of this repository.

## Install

The recommended way to install is from the WordPress.org plugin directory:

1. WP Admin → Plugins → Add New
2. Search for **EaseAccess Lite**
3. Install and activate

## Develop

```bash
# Clone
git clone https://github.com/easeaccess/easeaccess-lite.git
cd easeaccess-lite

# Install JS deps
npm install

# Build (admin + frontend bundles into ./build)
npm run build

# Watch-rebuild during development
npm start
```

The compiled assets in `/build/` are committed to the repo so a downloaded ZIP works out of the box without a build step.

## Structure

```
easeaccess-lite/
├── easeaccess-lite.php       Plugin entry
├── readme.txt                WordPress.org listing
├── license.txt
├── uninstall.php             Clean uninstall
├── includes/
│   ├── API/Library.php       REST endpoints (widget settings, statement, dictionary)
│   ├── Admin/Assets.php      Admin enqueue
│   ├── Frontend/Assets.php   Frontend enqueue
│   └── admin.php             Admin menu
└── src/                      React source for admin + widget
```

## Contributing

Bug reports and pull requests are welcome. Please:

1. Open an issue first to discuss large changes
2. Keep PRs focused and small
3. Run `npm run lint:js` and `npm run format` before submitting

## License

GPL-2.0-or-later. See [license.txt](license.txt).
