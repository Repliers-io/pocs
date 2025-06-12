#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Get component name from command line arguments
const componentName = process.argv[2];
const componentPath = process.argv[3];

if (!componentName) {
  console.error("❌ Please provide a component name");
  console.log("Usage: npm run create-component <ComponentName> [path]");
  console.log("Example: npm run create-component MyNewComponent");
  console.log("Example: npm run create-component MyNewComponent statistics");
  process.exit(1);
}

// Ensure component name is valid PascalCase (no hyphens, starts with capital)
const pascalCaseName = componentName
  .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
  .replace(/^[a-z]/, (c) => c.toUpperCase());

// Convert PascalCase to kebab-case for file/folder names
const kebabCaseName = pascalCaseName
  .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
  .toLowerCase();

// Determine the target directory
const basePath = componentPath
  ? path.join("src", "components", componentPath, kebabCaseName)
  : path.join("src", "components", kebabCaseName);

// Create the directory
if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, { recursive: true });
  console.log(`✅ Created directory: ${basePath}`);
} else {
  console.error(`❌ Directory already exists: ${basePath}`);
  process.exit(1);
}

// Generate the component file content
const componentFileContent = `import React from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Types
interface ${pascalCaseName}Props {
  // Add your props here
  className?: string;
}

/**
 * ${pascalCaseName} Component
 * 
 * @description Add a description of what this component does
 * @param props - The component props
 * @returns JSX.Element
 */
export function ${pascalCaseName}({ className, ...props }: ${pascalCaseName}Props) {
  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-4">${pascalCaseName}</h2>
      <p className="text-gray-600">
        This is a new component. Start building your UI here!
      </p>
      
      {/* Add your component content here */}
      <div className="mt-4 space-y-2">
        <Input placeholder="Example input" />
        <Button>Example Button</Button>
      </div>
    </div>
  );
}
`;

// Generate the story file content
const storyFileContent = `import type { Meta, StoryObj } from "@storybook/react";
import { ${pascalCaseName} } from "./${kebabCaseName}";

/**
 * ## 👤 User Story
 *
 * As a user, I want to [describe the main user need this component addresses].
 *
 * This component helps users:
 * - [Benefit 1]
 * - [Benefit 2]
 * - [Benefit 3]
 *
 * ## 🚀 Quick Start
 *
 * 1. Install dependencies:
 * \`\`\`bash
 * npm install [list required dependencies]
 * \`\`\`
 *
 * 2. Import and use the component:
 * \`\`\`tsx
 * import { ${pascalCaseName} } from "./components/${kebabCaseName}";
 *
 * function App() {
 *   return (
 *     <div className="container mx-auto p-4">
 *       <${pascalCaseName} />
 *     </div>
 *   );
 * }
 * \`\`\`
 *
 * ## 💡 Key Features
 *
 * 1. **Feature 1** - Description of feature 1
 * 2. **Feature 2** - Description of feature 2
 * 3. **Feature 3** - Description of feature 3
 *
 * ## 🔧 Props
 *
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | className | string | undefined | Additional CSS classes |
 *
 */

const meta: Meta<typeof ${pascalCaseName}> = {
  title: "Components/${pascalCaseName}",
  component: ${pascalCaseName},
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the component",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ${pascalCaseName}>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};

export const WithCustomClass: Story = {
  args: {
    className: "border border-gray-300 p-4 rounded-lg",
  },
};

// Add more stories as needed
export const Example: Story = {
  args: {
    // Add example props here
  },
};
`;

// Write the component file
const componentFilePath = path.join(basePath, `${kebabCaseName}.tsx`);
fs.writeFileSync(componentFilePath, componentFileContent);
console.log(`✅ Created component file: ${componentFilePath}`);

// Write the story file
const storyFilePath = path.join(basePath, `${kebabCaseName}.stories.tsx`);
fs.writeFileSync(storyFilePath, storyFileContent);
console.log(`✅ Created story file: ${storyFilePath}`);

console.log(`\n🎉 Component ${pascalCaseName} created successfully!`);
if (componentName !== pascalCaseName) {
  console.log(
    `📝 Note: Component name was converted from "${componentName}" to "${pascalCaseName}" for valid JavaScript syntax.`
  );
}
console.log(`\nFiles created:`);
console.log(`- ${componentFilePath}`);
console.log(`- ${storyFilePath}`);
console.log(`\nNext steps:`);
console.log(`1. Update the component props and implementation`);
console.log(`2. Update the story documentation and examples`);
console.log(`3. Run 'npm run storybook' to see your component in Storybook`);
