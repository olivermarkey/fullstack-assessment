export abstract class BaseController {
    protected handleError(error: Error) {
      // Common error handling logic
      console.error(error);
      return { error: error.message };
    }
  }