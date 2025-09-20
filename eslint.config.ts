import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import roblox from "eslint-plugin-roblox-ts";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default defineConfig(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	roblox.configs.tsRecommendedCompat,
	roblox.configs.recommended,
	{
		plugins: {
			"simple-import-sort": simpleImportSort,
		},
		rules: {
			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error",
		},
	},
	{
		plugins: {
			"unused-imports": unusedImports,
		},
		rules: {
			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": [
				"warn",
				{
					varsIgnorePattern: "^_",
					argsIgnorePattern: "^_",
				},
			],
		},
	},
	globalIgnores(["out/**"]),
	prettierRecommended,
);
