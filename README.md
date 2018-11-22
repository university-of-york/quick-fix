# Responsive quick fix
## For 2013 style, vintage style, staff and students pages, and Festival of Ideas site

### Local development

```bash
grunt dev
```

### Generating files for upload

To generate minified files, run:

```bash
grunt build
```

### Uploading to the CMS

The generated files from the build command all live within the local `/upload` folder. The required assets should be uploaded to the following folder on the 'static' web/FTP account: `/static/rqf`.
