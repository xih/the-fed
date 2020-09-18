import { createManyAsyncActions } from "../../utils"

const { AsyncTypes, AsyncCreators } = createManyAsyncActions(["startup"])

export { AsyncTypes as StartupAsyncTypes, AsyncCreators as StartupAsyncActions }
