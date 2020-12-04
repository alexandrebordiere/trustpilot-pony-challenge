<template>
  <main id="app" class="bg-white p-4 rounded-lg">
    <div v-if="state.hiddenUrl === null">
      <div v-if="maze.uuid !== ''">
        <h1 class="mb-4 text-2xl text-center">{{ maze.uuid }}</h1>
        <div class="grid"
          :style="[
            `grid-template-columns: repeat(${maze.dimensions.width}, 1fr);`,
            `grid-template-rows: repeat(${maze.dimensions.height}, 1fr);`
          ]">
          <div v-for="(cell, position) in maze.structure"
            :key="position"
            class="border border-transparent flex items-center justify-center p-2"
            :class="{
              'border-t-black': cell.includes('north'),
              'border-l-black': cell.includes('west'),
              'border-r-black': isLastColumn(position),
              'border-b-black': isLastRow(position)
            }">
            <span v-if="position === maze.positions.domokun">👹</span>
            <span v-else-if="position === maze.positions.end">🚪</span>
            <span v-else-if="position === maze.positions.pony">🐴</span>
            <span v-else>•</span>
          </div>
        </div>
      </div>
      <div v-else>
        <form @submit.prevent.once="() => state.shouldDisableButton = true && generateAndSolveMaze()">
          <div class="flex items-center mb-8">
            <label for="height" class="flex flex-1 flex-col font-semibold mr-6 text-lg">
              Height
              <small class="text-gray-500 text-sm">Must be between 15 and 25</small>
            </label>
            <input type="number"
              id="height"
              class="appearance-none bg-gray-200 block border flex-1 py-3 px-4 rounded text-gray-700 focus:bg-white focus:outline-none"
              placeholder="15"
              min="15"
              max="25"
              required
              v-model="form.height">
          </div>
          <div class="flex items-center mb-8">
            <label for="width" class="flex flex-1 flex-col font-semibold mr-6 text-lg">
              Width
              <small class="text-gray-500 text-sm">Must be between 15 and 25</small>
            </label>
            <input type="number"
              id="width"
              class="appearance-none bg-gray-200 block border flex-1 py-3 px-4 rounded text-gray-700 focus:bg-white focus:outline-none"
              placeholder="15"
              min="15"
              max="25"
              required
              v-model="form.width">
          </div>
          <div class="flex items-center mb-8">
            <label for="difficulty" class="flex flex-1 flex-col font-semibold mr-6 text-lg">
              Difficulty
              <small class="text-gray-500 text-sm">Must be between 0 and 10</small>
            </label>
            <input type="number"
              id="difficulty"
              class="appearance-none bg-gray-200 block border flex-1 py-3 px-4 rounded text-gray-700 focus:bg-white focus:outline-none"
              placeholder="0"
              min="0"
              max="10"
              required
              v-model="form.difficulty">
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-teal-500 font-semibold px-4 py-3 rounded-lg shadow-md text-white hover:bg-teal-600"
              :class="{ 'opacity-50 pointer-events-none': state.shouldDisableButton }"
              :disabled="state.shouldDisableButton">
              Generate a new maze
            </button>
          </div>
        </form>
      </div>
    </div>
    <div v-else>
      <img :src="`https://ponychallenge.trustpilot.com/${state.hiddenUrl}`" alt="" height="500" width="750">
    </div>
  </main>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';

  import useCell from '@/composables/useCell';
  import useMaze from '@/composables/useMaze';
  import useMovement from '@/composables/useMovement';
  import http from '@/http';

  export default defineComponent({
    name: 'App',
    setup () {
      const state = reactive<{ hiddenUrl: string | null, shouldDisableButton: boolean}>({
        hiddenUrl: null,
        shouldDisableButton: false
      });

      const { form, maze, fetchMaze, generateMaze } = useMaze();
      const { isLastColumn, isLastRow } = useCell(maze);
      const { getShortestPath } = useMovement(maze);

      const generateAndSolveMaze = async () => {
        const { uuid } = await generateMaze();

        const shortestPath = getShortestPath(maze.positions.pony);

        for (const { direction } of shortestPath) {
          const { data: { state: result, 'hidden-url': hiddenUrl = null } } = await http.post(`/maze/${uuid}`, { direction });

          await fetchMaze(uuid);

          state.hiddenUrl = hiddenUrl;

          if (result === 'over') {
            break;
          }
        }
      };

      return {
        form,
        generateAndSolveMaze,
        isLastColumn,
        isLastRow,
        maze,
        state
      };
    }
  });
</script>
