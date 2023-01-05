import {DateScalar} from '@/app/common/init/scalar/dateScalar';
import {DatetimeScalar} from '@/app/common/init/scalar/datetimeScalar';
import {TimestampScalar} from '@/app/common/init/scalar/timestampScalar';
import {VoidScalar} from '@/app/common/init/scalar/voidScalar';
import {GqlAppBuilderModule} from '@/utils/gqlAppBuilder';

export const initModule: GqlAppBuilderModule = {
    resolvers: {
        Void: VoidScalar,
        Date: DateScalar,
        Datetime: DatetimeScalar,
        Timestamp: TimestampScalar,
        Query: {
            nowDate: () => new Date(),
            nowDatetime: () => new Date(),
            nowTimestamp: () => new Date()
        }
    }
}
