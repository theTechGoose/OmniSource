import { assertEquals, assertInstanceOf } from "@std/assert";
import {describe, it} from '@std/bdd';
import {spy} from '@std/mock';
import { withTryCatch } from './~util.ts';

describe("withTryCatch", () => {
  it("should return the result of the callback and null error if no error is thrown", () => {
    const mockCallback = spy(() => "success");
    const [result, error] = withTryCatch(mockCallback);

    assertEquals(result, "success");
    assertEquals(error, null);
    assertEquals(mockCallback.calls.length, 1);
  });

  it("should return undefined and the error if the callback throws an error", () => {
    const mockError = new Error("Something went wrong");
    const mockCallback = spy(() => {
      throw mockError;
    });

    const [result, error] = withTryCatch(mockCallback);

    assertEquals(result, undefined);
    assertEquals(error, mockError);
    assertEquals(mockCallback.calls.length, 1);
  });

  it("should wrap non-Error objects thrown as errors into an Error instance", () => {
    const mockCallback = spy(() => {
      throw "This is a string error";
    });

    const [result, error] = withTryCatch(mockCallback);

    assertEquals(result, undefined);
    assertInstanceOf(error, Error);
    assertEquals(error?.message, "This is a string error");
    assertEquals(mockCallback.calls.length, 1);
  });

  it("should handle callbacks that return undefined without throwing an error", () => {
    const mockCallback = spy(() => undefined);
    const [result, error] = withTryCatch(mockCallback);

    assertEquals(result, undefined);
    assertEquals(error, null);
    assertEquals(mockCallback.calls.length, 1);
  });

  it("should handle callbacks that throw null as an error and wrap it in an Error instance", () => {
    const mockCallback = spy(() => {
      throw null;
    });

    const [result, error] = withTryCatch(mockCallback);

    assertEquals(result, undefined);
    assertInstanceOf(error, Error);
    assertEquals(error?.message, "null");
    assertEquals(mockCallback.calls.length, 1);
  });

  it("should handle callbacks that throw undefined as an error and wrap it in an Error instance", () => {
    const mockCallback = spy(() => {
      throw undefined;
    });

    const [result, error] = withTryCatch(mockCallback);

    assertEquals(result, undefined);
    assertInstanceOf(error, Error);
    assertEquals(error?.message, "undefined");
    assertEquals(mockCallback.calls.length, 1);
  });
});
