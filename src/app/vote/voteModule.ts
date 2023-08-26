import {pubsub} from '@/pubSub';
import {GqlAppBuilderModule} from '@/utils/gqlAppBuilder';
import {redisClient} from "@/redisClient";

export const voteModule: GqlAppBuilderModule = {
    resolvers: {
        Subscription: {
            someoneVote: {
                subscribe: () => ({
                    [Symbol.asyncIterator]: () => pubsub.asyncIterator('SOMEONE_VOTE')
                })
            }, voteInfoChange: {
                subscribe: () => ({
                    [Symbol.asyncIterator]: () => pubsub.asyncIterator('VOTE_INFO_CHANGE')
                })
            }
        },
        Mutation: {
            updateSelectOptions: async (injector, parent, args) => {
                await pubsub.publish('VOTE_INFO_CHANGE', {
                    voteInfoChange: {
                        voteId: args.voteId,
                        selectOptions: args.options
                    }
                });
                await redisClient.set('VOTE_INFO', JSON.stringify(args))
            },
            vote: async (injector, parent, args) => {
                await pubsub.publish('SOMEONE_VOTE', {
                    someoneVote: {
                        voteId: args.voteData.voteId,
                        user: args.voteData.user,
                        idx: args.voteData.idx
                    }
                });
            }
        },
        Query: {
            getVoteInfo: async () => {
                const data = JSON.parse((await redisClient.get('VOTE_INFO')) )
                return {
                    voteId: data.voteId,
                    selectOptions: data.options
                }
            }
        }
    }
}

