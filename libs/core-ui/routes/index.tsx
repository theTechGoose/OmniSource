import { h } from "preact";
import Stories from "../islands/stories/Button.story.tsx";

export default function Home() {
  return (
    <div class="min-h-screen bg-gray-100">
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4">
          <h1 class="text-3xl font-bold text-gray-900">Core UI Components</h1>
        </div>
      </header>
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Stories />
      </main>
    </div>
  );
}
