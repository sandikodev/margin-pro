import type { Plugin } from 'vite';

/**
 * Koda Syntax Parser (.koda) 💎
 * Transforms declarative Koda files into React/JSX.
 * Inspired by Flutter & SwiftUI.
 */
export function kodaPlugin(): Plugin {
    return {
        name: 'vite-plugin-koda',
        enforce: 'pre',
        transform(code, id) {
            if (!id.endsWith('.koda')) return null;

            // 1. Basic Transformation Logic (Regex-based POC)
            // This will mature into a proper AST-based parser.
            let transformed = code;

            // Transform imports: import @koda/ui -> import { ... } from "@koda/ui"
            transformed = transformed.replace(/import\s+@koda\/ui;/g, 'import { BentoCard, GradientCard, ResponsiveGrid } from "@koda/ui";');

            // Transform Screen/Widget definitions
            transformed = transformed.replace(/Screen\s+(\w+)\s*{/g, 'export function $1() {');

            // Transform state declarations
            transformed = transformed.replace(/state\s+(\w+)\s*=\s*(.+);/g, 'const [$1, set$1] = React.useState($2);');

            // Simple Widget transformation: Card { title: "..." } -> <Card title="...">
            // We look for Capitalized words followed by {
            // This is a very optimistic regex for the POC.
            transformed = transformed.replace(/([A-Z][a-zA-Z.]+)\s*{([^}]*)}/g, (_match: string, widget: string, content: string) => {
                const props: string[] = [];
                let innerContent = content.trim();

                // Extract props: title: "Value";
                innerContent = innerContent.replace(/(\w+):\s*([^;]+);/g, (_m: string, key: string, val: string) => {
                    props.push(`${key}={${val.trim()}}`);
                    return "";
                });

                return `<${widget} ${props.join(' ')}>${innerContent.trim()}</${widget}>`;
            });

            // Wrap in React boilerplate
            const finalCode = `
        import React from 'react';
        ${transformed}
      `;

            return {
                code: finalCode,
                map: null,
            };
        },
    };
}
