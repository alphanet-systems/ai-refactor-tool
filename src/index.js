// dev-tool.js (Version 3.0 - Enhanced AI Analysis Tool)
// Enhanced tool for AI-assisted codebase analysis and refactoring workflow

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const babelParser = require('@babel/parser');
const crypto = require('crypto');

// --- CONSTANTS ---
const ANALYSIS_DIR = 'ai-analysis';
const ANALYSIS_SUMMARY_FILE = 'analysis_summary.md';
const MACHINE_CONTEXT_FILE = 'machine_context.json';
const TASK_BACKLOG_FILE = 'task_backlog.json';
const CODE_INVENTORY_FILE = 'code_inventory.json';
const DEPENDENCY_MAP_FILE = 'dependency_map.json';
const METRICS_FILE = 'code_metrics.json';

// Supported file extensions for analysis
const SUPPORTED_EXTENSIONS = [
    '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.astro',
    '.json', '.md', '.css', '.scss', '.sass', '.less',
    '.html', '.htm', '.xml', '.yml', '.yaml', '.toml'
];

// --- UTILITY FUNCTIONS ---
function createDirectory(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
    }
}

function getFileHash(filePath) {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
}

function getFileSize(filePath) {
    return fs.statSync(filePath).size;
}

function isTextFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return SUPPORTED_EXTENSIONS.includes(ext);
}

// --- ENHANCED FILE ANALYSIS ---
function analyzeJavaScriptFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const ast = babelParser.parse(content, {
            sourceType: 'module',
            allowImportExportEverywhere: true,
            allowReturnOutsideFunction: true,
            plugins: ['jsx', 'typescript', 'decorators-legacy']
        });

        const imports = [];
        const exports = [];
        const functions = [];
        const classes = [];
        const variables = [];

        // Enhanced AST traversal would go here
        // For now, basic regex-based analysis
        const importMatches = content.match(/import.*?from\s+['"`]([^'"`]+)['"`]/g) || [];
        const exportMatches = content.match(/export\s+(?:default\s+)?(?:class|function|const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g) || [];
        
        importMatches.forEach(imp => {
            const match = imp.match(/from\s+['"`]([^'"`]+)['"`]/);
            if (match) imports.push(match[1]);
        });

        exportMatches.forEach(exp => {
            const match = exp.match(/(?:class|function|const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
            if (match) exports.push(match[1]);
        });

        return {
            type: 'javascript',
            imports,
            exports,
            functions,
            classes,
            variables,
            complexity: calculateComplexity(content),
            linesOfCode: content.split('\n').length,
            hasTests: content.includes('test(') || content.includes('describe(') || content.includes('it('),
            frameworks: detectFrameworks(content)
        };
    } catch (error) {
        return {
            type: 'javascript',
            error: error.message,
            imports: [],
            exports: [],
            complexity: 0
        };
    }
}

function calculateComplexity(content) {
    // Simple cyclomatic complexity estimation
    const complexityKeywords = ['if', 'else', 'for', 'while', 'case', 'catch', 'return', '&&', '||'];
    let complexity = 1;
    
    complexityKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        const matches = content.match(regex);
        if (matches) complexity += matches.length;
    });
    
    return complexity;
}

function detectFrameworks(content) {
    const frameworks = [];
    const frameworkPatterns = {
        'React': /import.*?React|from\s+['"`]react['"`]|jsx|useState|useEffect/,
        'Vue': /import.*?Vue|from\s+['"`]vue['"`]|\.vue$|<template>/,
        'Angular': /import.*?@angular|Component\(|Injectable\(|NgModule\(/,
        'Svelte': /import.*?svelte|\.svelte$|<script>/,
        'Astro': /\.astro$|---[\s\S]*?---|import.*?astro/,
        'Express': /require\(['"`]express['"`]\)|from\s+['"`]express['"`]/,
        'Next.js': /next\/|getStaticProps|getServerSideProps/,
        'Nuxt.js': /nuxt|asyncData|fetch\(/
    };

    Object.entries(frameworkPatterns).forEach(([framework, pattern]) => {
        if (pattern.test(content)) {
            frameworks.push(framework);
        }
    });

    return frameworks;
}

function analyzeConfigFile(filePath) {
    const fileName = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const configTypes = {
        'package.json': 'npm',
        'composer.json': 'composer',
        'requirements.txt': 'python',
        'Gemfile': 'ruby',
        'go.mod': 'go',
        'Cargo.toml': 'rust'
    };

    return {
        type: 'config',
        configType: configTypes[fileName] || 'unknown',
        content: fileName === 'package.json' ? JSON.parse(content) : content
    };
}

// --- ENHANCED DIRECTORY TRAVERSAL ---
function traverseDirectory(dir, options = {}) {
    const { ignorePatterns = ['.git', 'node_modules', '.next', 'dist', 'build'] } = options;
    const fileList = [];
    
    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
            if (ignorePatterns.some(pattern => item.includes(pattern))) continue;
            
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                traverse(fullPath);
            } else if (isTextFile(fullPath)) {
                fileList.push({
                    path: fullPath,
                    relativePath: path.relative(dir, fullPath),
                    size: stat.size,
                    modified: stat.mtime,
                    hash: getFileHash(fullPath)
                });
            }
        }
    }
    
    traverse(dir);
    return fileList;
}

// --- ENHANCED ANALYSIS LOGIC ---
function runAnalysis(baseDir, options = {}) {
    console.log(`🔍 Starting enhanced analysis of: ${baseDir}`);
    
    if (!fs.existsSync(baseDir)) {
        console.error(`❌ Directory not found: ${baseDir}`);
        process.exit(1);
    }

    const analysisDir = path.join(baseDir, ANALYSIS_DIR);
    createDirectory(analysisDir);

    // 1. Inventory all files
    console.log('📋 Creating file inventory...');
    const files = traverseDirectory(baseDir, options);
    
    const codeInventory = {
        totalFiles: files.length,
        totalSize: files.reduce((sum, f) => sum + f.size, 0),
        fileTypes: {},
        files: files.map(f => ({
            ...f,
            extension: path.extname(f.relativePath),
            directory: path.dirname(f.relativePath)
        }))
    };

    // Count file types
    codeInventory.files.forEach(file => {
        const ext = file.extension || 'no-extension';
        codeInventory.fileTypes[ext] = (codeInventory.fileTypes[ext] || 0) + 1;
    });

    fs.writeFileSync(
        path.join(analysisDir, CODE_INVENTORY_FILE),
        JSON.stringify(codeInventory, null, 2)
    );

    // 2. Analyze individual files
    console.log('🔬 Analyzing individual files...');
    const fileAnalysis = {};
    const dependencyMap = { internal: {}, external: [] };
    const metrics = {
        totalLinesOfCode: 0,
        totalComplexity: 0,
        frameworks: new Set(),
        hasTests: false,
        configFiles: []
    };

    codeInventory.files.forEach(file => {
        const fullPath = file.path;
        const ext = path.extname(fullPath);
        
        if (['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.astro'].includes(ext)) {
            const analysis = analyzeJavaScriptFile(fullPath);
            fileAnalysis[file.relativePath] = analysis;
            
            metrics.totalLinesOfCode += analysis.linesOfCode || 0;
            metrics.totalComplexity += analysis.complexity || 0;
            if (analysis.hasTests) metrics.hasTests = true;
            
            analysis.frameworks?.forEach(fw => metrics.frameworks.add(fw));
            
            // Build dependency map
            analysis.imports?.forEach(imp => {
                if (imp.startsWith('.')) {
                    // Internal dependency
                    if (!dependencyMap.internal[file.relativePath]) {
                        dependencyMap.internal[file.relativePath] = [];
                    }
                    dependencyMap.internal[file.relativePath].push(imp);
                } else {
                    // External dependency
                    if (!dependencyMap.external.includes(imp)) {
                        dependencyMap.external.push(imp);
                    }
                }
            });
        } else if (['package.json', 'composer.json', 'requirements.txt'].includes(path.basename(fullPath))) {
            const configAnalysis = analyzeConfigFile(fullPath);
            metrics.configFiles.push({
                file: file.relativePath,
                type: configAnalysis.configType,
                content: configAnalysis.content
            });
        }
    });

    // Convert Set to Array for JSON serialization
    metrics.frameworks = Array.from(metrics.frameworks);

    // 3. Save analysis results
    fs.writeFileSync(
        path.join(analysisDir, DEPENDENCY_MAP_FILE),
        JSON.stringify(dependencyMap, null, 2)
    );

    fs.writeFileSync(
        path.join(analysisDir, METRICS_FILE),
        JSON.stringify(metrics, null, 2)
    );

    // 4. Generate AI-friendly summary
    const summary = generateAnalysisSummary(codeInventory, fileAnalysis, dependencyMap, metrics, baseDir);
    fs.writeFileSync(
        path.join(analysisDir, ANALYSIS_SUMMARY_FILE),
        summary
    );

    // 5. Generate machine context
    const machineContext = {
        timestamp: new Date().toISOString(),
        projectPath: baseDir,
        analysisVersion: '3.0',
        summary: {
            fileCount: codeInventory.totalFiles,
            totalSize: codeInventory.totalSize,
            linesOfCode: metrics.totalLinesOfCode,
            complexity: metrics.totalComplexity,
            frameworks: metrics.frameworks,
            hasTests: metrics.hasTests
        },
        files: fileAnalysis,
        dependencies: dependencyMap,
        metrics: metrics
    };

    fs.writeFileSync(
        path.join(analysisDir, MACHINE_CONTEXT_FILE),
        JSON.stringify(machineContext, null, 2)
    );

    // 6. Generate initial task backlog
    const taskBacklog = generateTaskBacklog(machineContext);
    fs.writeFileSync(
        path.join(analysisDir, TASK_BACKLOG_FILE),
        JSON.stringify(taskBacklog, null, 2)
    );

    console.log(`✅ Analysis complete! Results saved in: ${analysisDir}`);
    console.log(`📊 Found ${codeInventory.totalFiles} files with ${metrics.totalLinesOfCode} lines of code`);
    console.log(`🔧 Detected frameworks: ${metrics.frameworks.join(', ') || 'None'}`);
}

function generateAnalysisSummary(inventory, analysis, dependencies, metrics, projectPath) {
    return `# AI Refactoring Analysis Report

## Project Overview
- **Project Path**: ${projectPath}
- **Analysis Date**: ${new Date().toISOString()}
- **Total Files**: ${inventory.totalFiles}
- **Total Size**: ${(inventory.totalSize / 1024).toFixed(2)} KB
- **Lines of Code**: ${metrics.totalLinesOfCode}
- **Total Complexity**: ${metrics.totalComplexity}

## Technology Stack
${metrics.frameworks.length ? `- **Frameworks**: ${metrics.frameworks.join(', ')}` : '- **Frameworks**: None detected'}
- **Has Tests**: ${metrics.hasTests ? 'Yes' : 'No'}

## File Distribution
${Object.entries(inventory.fileTypes)
    .sort(([,a], [,b]) => b - a)
    .map(([ext, count]) => `- **${ext}**: ${count} files`)
    .join('\n')}

## Configuration Files
${metrics.configFiles.map(cf => `- **${cf.file}**: ${cf.type}`).join('\n') || 'None found'}

## External Dependencies
${dependencies.external.slice(0, 10).map(dep => `- ${dep}`).join('\n')}
${dependencies.external.length > 10 ? `... and ${dependencies.external.length - 10} more` : ''}

## Potential Refactoring Areas

### Code Quality
- Files with high complexity (>20): ${Object.entries(analysis)
    .filter(([, a]) => a.complexity && a.complexity > 20)
    .length}
- Large files (>500 LOC): ${Object.entries(analysis)
    .filter(([, a]) => a.linesOfCode && a.linesOfCode > 500)
    .length}

### Architecture
- Internal dependencies: ${Object.keys(dependencies.internal).length} files have internal imports
- External dependencies: ${dependencies.external.length} unique packages

### Recommendations
1. **Code Organization**: Review file structure and module organization
2. **Testing**: ${metrics.hasTests ? 'Expand test coverage' : 'Add comprehensive testing'}
3. **Documentation**: Add/update README and inline documentation
4. **Dependencies**: Audit and optimize external dependencies
5. **Performance**: Review large files and complex functions
6. **Standards**: Implement consistent coding standards and linting

## Next Steps
Use the generated task backlog to systematically address identified issues.
Each task is designed to be AI-assistable and includes relevant context.
`;
}

function generateTaskBacklog(context) {
    const tasks = [];
    let taskId = 1;

    // Generate tasks based on analysis
    if (!context.summary.hasTests) {
        tasks.push({
            id: `T-${String(taskId).padStart(3, '0')}`,
            title: 'Add Testing Framework Setup',
            priority: 'high',
            status: 'pending',
            description: 'Set up a testing framework and create initial test structure',
            estimatedEffort: 'medium',
            tags: ['testing', 'setup'],
            sourceFiles: ['package.json'],
            prompt: `Please help set up a comprehensive testing framework for this project. Analyze the current tech stack and recommend appropriate testing tools. Create basic test structure and configuration files.`
        });
        taskId++;
    }

    if (context.summary.complexity > 100) {
        tasks.push({
            id: `T-${String(taskId).padStart(3, '0')}`,
            title: 'Refactor High Complexity Functions',
            priority: 'medium',
            status: 'pending',
            description: 'Identify and refactor functions with high cyclomatic complexity',
            estimatedEffort: 'large',
            tags: ['refactoring', 'complexity'],
            sourceFiles: Object.keys(context.files).filter(f => 
                context.files[f].complexity && context.files[f].complexity > 20
            ),
            prompt: `Please analyze these high-complexity files and suggest refactoring strategies to reduce complexity while maintaining functionality.`
        });
        taskId++;
    }

    // Add more task generation logic based on analysis...

    return {
        version: '3.0',
        generated: new Date().toISOString(),
        totalTasks: tasks.length,
        tasks
    };
}

// --- WORK COMMAND (Enhanced) ---
async function runWork(analysisDir, options) {
    const backlogPath = path.join(analysisDir, TASK_BACKLOG_FILE);
    const contextPath = path.join(analysisDir, MACHINE_CONTEXT_FILE);
    
    if (!fs.existsSync(backlogPath)) {
        console.error(`❌ Task backlog not found at "${backlogPath}". Run 'analyze' first.`);
        process.exit(1);
    }

    const backlog = JSON.parse(fs.readFileSync(backlogPath, 'utf8'));
    const context = fs.existsSync(contextPath) 
        ? JSON.parse(fs.readFileSync(contextPath, 'utf8'))
        : null;
    
    let taskId = options.task;

    if (!taskId) {
        const pendingTasks = backlog.tasks.filter(t => t.status === 'pending');
        if (pendingTasks.length === 0) {
            console.log('🎉 All tasks completed!');
            return;
        }
        
        console.log('\n--- PENDING TASKS ---');
        pendingTasks.forEach(task => {
            console.log(`[${task.id}] ${task.title} (${task.priority}) - ${task.estimatedEffort}`);
            console.log(`    ${task.description}`);
            console.log(`    Tags: ${task.tags?.join(', ') || 'none'}\n`);
        });
        console.log('Use --task <ID> to generate prompt for a specific task');
        return;
    }

    const task = backlog.tasks.find(t => t.id.toLowerCase() === taskId.toLowerCase());
    if (!task) {
        console.error('❌ Task not found');
        process.exit(1);
    }

    // Generate enhanced prompt
    let sourceContext = '';
    if (task.sourceFiles?.length) {
        const baseDir = context?.projectPath || process.cwd();
        sourceContext = task.sourceFiles.map(file => {
            const fullPath = path.join(baseDir, file);
            if (fs.existsSync(fullPath)) {
                const content = fs.readFileSync(fullPath, 'utf8');
                return `### ${file}\n\`\`\`${path.extname(file).slice(1)}\n${content}\n\`\`\``;
            }
            return `### ${file} (Not Found)`;
        }).join('\n\n');
    }

    const enhancedPrompt = `# Task: ${task.title}

${task.description}

**Priority:** ${task.priority}
**Estimated Effort:** ${task.estimatedEffort}
**Tags:** ${task.tags?.join(', ') || 'none'}

## Context
${context ? `This is part of a ${context.summary.frameworks.join(', ') || 'JavaScript'} project with ${context.summary.fileCount} files and ${context.summary.linesOfCode} lines of code.` : ''}

${task.prompt}

## Source Files
${sourceContext || 'No source files specified for this task.'}

---
*Generated by AI Refactoring Tool v3.0*`;

    process.stdout.write(enhancedPrompt);
}

// --- COMMAND LINE INTERFACE ---
program
    .name('ai-refactor-tool')
    .description('Enhanced AI-assisted codebase analysis and refactoring tool')
    .version('3.0.0');

program
    .command('analyze <directory>')
    .description('Analyze a codebase and generate AI-friendly analysis')
    .option('-i, --ignore <patterns...>', 'Additional patterns to ignore', [])
    .action((directory, options) => {
        runAnalysis(directory, { ignorePatterns: [...options.ignore, '.git', 'node_modules', 'dist', 'build'] });
    });

program
    .command('work <analysisDir>')
    .description('Work with generated tasks')
    .option('-t, --task <taskId>', 'Generate prompt for specific task')
    .action(runWork);

program
    .command('status <analysisDir>')
    .description('Show project analysis status and metrics')
    .action((analysisDir) => {
        const contextPath = path.join(analysisDir, MACHINE_CONTEXT_FILE);
        if (fs.existsSync(contextPath)) {
            const context = JSON.parse(fs.readFileSync(contextPath, 'utf8'));
            console.log('📊 Project Status:');
            console.log(`Files: ${context.summary.fileCount}`);
            console.log(`Lines of Code: ${context.summary.linesOfCode}`);
            console.log(`Complexity: ${context.summary.complexity}`);
            console.log(`Frameworks: ${context.summary.frameworks.join(', ') || 'None'}`);
            console.log(`Last Analysis: ${new Date(context.timestamp).toLocaleString()}`);
        } else {
            console.log('❌ No analysis found. Run analyze command first.');
        }
    });

if (require.main === module) {
    program.parse();
}

module.exports = { runAnalysis, runWork };
