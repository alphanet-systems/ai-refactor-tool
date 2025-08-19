# 🤖 AI Refactor Tool

> AI-powered codebase analysis and refactoring assistant that helps you systematically improve your code quality

[![npm version](https://badge.fury.io/js/ai-refactor-tool.svg)](https://badge.fury.io/js/ai-refactor-tool)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/yourusername/ai-refactor-tool/workflows/Node.js%20CI/badge.svg)](https://github.com/yourusername/ai-refactor-tool/actions)

## ✨ Features

- 🔍 **Smart Code Analysis** - Analyzes your entire codebase and identifies improvement opportunities
- 🎯 **AI-Ready Tasks** - Generates structured tasks perfect for AI assistants like Claude, ChatGPT, or Copilot
- 📊 **Comprehensive Metrics** - Code complexity, dependency mapping, framework detection
- 🔧 **Framework Agnostic** - Supports React, Vue, Angular, Astro, Next.js, and more
- 📝 **Rich Reporting** - Human-readable summaries and machine-readable JSON outputs
- 🚀 **CLI Integration** - Seamlessly integrates into your development workflow

## 🚀 Quick Start

### Installation

```bash
# Install globally
npm install -g ai-refactor-tool

# Or use with npx
npx ai-refactor-tool analyze ./my-project
```

### Basic Usage

```bash
# Analyze your project
ai-refactor analyze ./my-project

# View generated tasks
ai-refactor work ./my-project/ai-analysis

# Generate AI prompt for a specific task
ai-refactor work ./my-project/ai-analysis --task T-001
```

## 📖 Usage Examples

### Analyzing a React Project

```bash
# Analyze a React project with custom ignore patterns
ai-refactor analyze ./my-react-app --ignore dist build coverage

# Check project status
ai-refactor status ./my-react-app/ai-analysis

# Get AI prompt for testing setup
ai-refactor work ./my-react-app/ai-analysis --task T-001 | pbcopy
```

### Working with AI Assistants

1. **Analyze your project**:
   ```bash
   ai-refactor analyze ./my-project
   ```

2. **Get available tasks**:
   ```bash
   ai-refactor work ./my-project/ai-analysis
   ```

3. **Generate AI prompt**:
   ```bash
   ai-refactor work ./my-project/ai-analysis --task T-001
   ```

4. **Paste the output to your AI assistant** (Claude, ChatGPT, etc.)

## 📊 What Gets Analyzed

### Code Quality Metrics
- **Cyclomatic Complexity** - Identifies overly complex functions
- **Lines of Code** - Tracks file and project size
- **Technical Debt** - Highlights areas needing attention

### Project Structure
- **File Organization** - Analyzes directory structure
- **Dependency Mapping** - Internal and external dependencies
- **Framework Detection** - Auto-detects React, Vue, Angular, etc.

### Generated Tasks
- **Testing Setup** - Identifies missing test infrastructure
- **Code Refactoring** - High-complexity function improvements
- **Documentation** - Missing or outdated documentation
- **Performance** - Large files and optimization opportunities

## 🏗️ Output Structure

After analysis, you'll get:

```
my-project/
└── ai-analysis/
    ├── analysis_summary.md      # Human-readable report
    ├── machine_context.json     # Complete project context
    ├── task_backlog.json       # Generated improvement tasks
    ├── code_inventory.json     # File listing and stats
    ├── dependency_map.json     # Dependency relationships
    └── code_metrics.json       # Quality metrics
```

## 🎯 Example Task Output

```markdown
# Task: Add Testing Framework Setup

Set up a comprehensive testing framework and create initial test structure

**Priority:** high
**Estimated Effort:** medium
**Tags:** testing, setup

## Context
This is part of a React project with 45 files and 3,247 lines of code.

Please help set up a comprehensive testing framework for this project...

## Source Files
### package.json
```json
{
  "name": "my-project",
  "dependencies": {
    "react": "^18.0.0"
  }
}
```
```

## 🛠️ Commands

### `analyze <directory>`
Analyzes a codebase and generates comprehensive analysis files.

**Options:**
- `-i, --ignore <patterns...>` - Additional patterns to ignore

**Example:**
```bash
ai-refactor analyze ./my-project --ignore dist build node_modules
```

### `work <analysisDir>`
Lists available tasks or generates AI prompts for specific tasks.

**Options:**
- `-t, --task <taskId>` - Generate prompt for specific task

**Examples:**
```bash
# List all pending tasks
ai-refactor work ./my-project/ai-analysis

# Generate prompt for specific task
ai-refactor work ./my-project/ai-analysis --task T-001
```

### `status <analysisDir>`
Shows project analysis status and key metrics.

**Example:**
```bash
ai-refactor status ./my-project/ai-analysis
```

## 🔧 Configuration

Create a `.airefactor.json` file in your project root:

```json
{
  "ignore": ["dist", "build", "coverage"],
  "complexity": {
    "maxComplexity": 20,
    "maxFileSize": 500
  },
  "frameworks": {
    "autoDetect": true,
    "preferred": ["react", "typescript"]
  },
  "tasks": {
    "generateTesting": true,
    "generateDocumentation": true,
    "generateRefactoring": true
  }
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/contributing.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-refactor-tool.git
cd ai-refactor-tool

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test
```

## 📚 Documentation

- [Installation Guide](./docs/installation.md)
- [Usage Examples](./docs/usage.md)
- [API Reference](./docs/api.md)
- [Contributing](./docs/contributing.md)

## 🗺️ Roadmap

- [ ] **Web Dashboard** - Visual interface for analysis results
- [ ] **AI Integration** - Direct integration with Claude/GPT APIs
- [ ] **Git Integration** - Track improvements over time
- [ ] **Team Features** - Collaborative workflows
- [ ] **IDE Extensions** - VSCode/WebStorm plugins
- [ ] **Docker Support** - Containerized analysis
- [ ] **Security Scanning** - Vulnerability detection
- [ ] **Performance Profiling** - Runtime analysis integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with inspiration from modern static analysis tools
- Powered by [Babel](https://babeljs.io/) for JavaScript parsing
- CLI built with [Commander.js](https://github.com/tj/commander.js/)

## 📞 Support

- 🐛 [Report Issues](https://github.com/yourusername/ai-refactor-tool/issues)
- 💬 [GitHub Discussions](https://github.com/yourusername/ai-refactor-tool/discussions)
- 📧 [Email Support](mailto:your.email@example.com)

---

**Made with ❤️ for developers who love clean, maintainable code**