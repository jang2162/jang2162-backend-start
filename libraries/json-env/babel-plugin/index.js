const jsonEnv = require('json-env');

module.exports = ({ types: t } /*: { types: Types } */) => {
    return {
        visitor: {
            ImportDeclaration(path /*: Path */) {
                if (path.node.source.value !== 'json-env') return;
                const specifiers = path.get('specifiers');
                for (const specifier of specifiers) {
                    const imported = specifier.get('imported');
                    let importedValue;
                    if (specifier.node.type === 'ImportDefaultSpecifier' || imported.node.name === 'env') {
                        importedValue = jsonEnv['env'];
                        if (!importedValue) {
                            throw imported.buildCodeFrameError('Method does not exist: env');
                        }
                    } else {
                        importedValue = jsonEnv[imported.node.name];
                        if (!importedValue) {
                            throw imported.buildCodeFrameError('Method does not exist: ' + imported.node.name);
                        }
                    }

                    let local = specifier.get('local');
                    let binding = local.scope.getBinding(local.node.name);

                    for (const ref of binding.referencePaths) {
                        let matchedMethod = importedValue;
                        let callExpression = ref.findParent(parent => {
                            if (parent.isCallExpression()) {
                                return true;
                            } else if (parent.isMemberExpression()) {
                                let property = parent.get('property');
                                let methodName = property.node.name;
                                let method = jsonEnv[methodName];

                                if (!method) {
                                    throw property.buildCodeFrameError('Method does not exist: ' + methodName);
                                }

                                matchedMethod = method;
                                return false;
                            } else {
                                throw parent.buildCodeFrameError("Unexpected node type: " + parent.type);
                            }
                        });

                        let args = callExpression.get('arguments');

                        let serializedArgs = args.map(arg => {
                            if (arg.isNullLiteral()) {
                                return null;
                            } else {
                                return arg.node.value
                            }
                        });

                        let result = matchedMethod(...serializedArgs);
                        let resultAst = t.valueToNode(result);
                        callExpression.replaceWith(resultAst);
                    }
                    specifier.remove();
                }

                path.remove();
            }
        }
    };
}