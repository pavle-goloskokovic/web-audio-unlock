# Changelog
All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows Semantic Versioning.

## [1.0.0] - 2026-03-02
### Added
- Dual package outputs for CommonJS and ESM.
- Minified default runtime entry with optional unminified subpath export.
- Type declarations for TypeScript consumers.

### Changed
- Modernized Web Audio unlock behavior for broader browser/device interaction events.
- Build pipeline switched to tsup-based dual output generation.
- Package exports map configured for `import` and `require`.

### Fixed
- Improved unlock reliability by performing silent buffer-start in gesture-driven flow.
- Reduced ES5 helper overhead in generated output.

## [0.1.0] - (initial release date)
### Added
- Initial Web Audio unlock helper implementation.
