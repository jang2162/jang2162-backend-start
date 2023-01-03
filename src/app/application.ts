import {createApplication} from 'graphql-modules';

export default createApplication({
    modules: [
    ],
    providers: [
    ],
    middlewares: {
        'Query': {
            '*': []
        },
        'Mutation': {
            '*': []
        }
    }
});
