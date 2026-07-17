import * as prettier from "prettier";

const pluginConfigs = {
  php: {
    parser: "php",
    import: () => import("@prettier/plugin-php/src/index.mjs"),
  },
  xml: {
    parser: "xml",
    import: () => import("@prettier/plugin-xml/src/plugin.js"),
  },
  ruby: {
    parser: "ruby",
    import: () => import("@prettier/plugin-ruby/src/plugin.js"),
  },
  java: {
    parser: "java",
    import: () => import("prettier-plugin-java/dist/index.mjs"),
  },
};

export const handleFormat = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: "Code is required" });
    }

    const lang = (language || "").toLowerCase();
    const config = pluginConfigs[lang];

    if (!config) {
      return res.status(400).json({
        success: false,
        message: `No formatter available for "${lang}"`,
      });
    }

    const pluginModule = await config.import();
    const plugin = pluginModule.default || pluginModule;

    const formatted = await prettier.format(code, {
      parser: config.parser,
      plugins: [plugin],
      tabWidth: 2,
      printWidth: 100,
    });

    res.json({ success: true, formatted });
  } catch (error) {
    console.error("[FORMAT_ERROR]", error.message);
    res.status(500).json({
      success: false,
      message: "Formatting failed: " + error.message,
    });
  }
};
