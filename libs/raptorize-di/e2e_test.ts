import { assertEquals } from "#assert";
import { Dependency } from "./mod.ts";
import { λ } from "./mod.ts";

// Common test classes
@Dependency
class ConsoleLogger {
  log(message: string): void {
    console.log(message);
  }
}

// Integration test demonstrating full dependency injection flow
Deno.test("Integration - Full dependency injection flow", async () => {
  // Define service interfaces
  interface ILogger {
    log(message: string): void;
  }

  interface IUserService {
    getCurrentUser(): string;
  }

  @Dependency
  class UserService implements IUserService {
    dooks = 'dookster'
    constructor(private logger: ConsoleLogger) {}

    getCurrentUser(): string {
      this.logger.log("Getting current user");
      return "test-user";
    }
  }

  // Test the complete flow
  λ.vault.init()
  const userService = λ(UserService);

  assertEquals(userService instanceof UserService, true);
  assertEquals(userService.getCurrentUser(), "test-user");
});

// Integration test for complex dependency graph
Deno.test("Integration - Complex dependency graph", () => {
  @Dependency
  class Config {
    getApiUrl(): string {
      return "https://api.example.com";
    }
  }

  @Dependency
  class HttpClient {
    constructor(private config: Config) {}

    getBaseUrl(): string {
      return this.config.getApiUrl();
    }
  }

  @Dependency
  class ApiService {
    constructor(
      private http: HttpClient,
      private logger: ConsoleLogger,
    ) {}

    init(): string {
      this.logger.log("Initializing API service");
      return this.http.getBaseUrl();
    }
  }

  λ.vault.init()
  const apiService = λ(ApiService);
  console.log(apiService)
  assertEquals(apiService instanceof ApiService, true);
  assertEquals(apiService.init(), "https://api.example.com");
});
