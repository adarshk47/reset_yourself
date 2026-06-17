import { addGoal, deleteGoal, getGoals } from "../src/storage/goals";
import type { Goal } from "../src/data/types";

function makeGoal(overrides: Partial<Goal> = {}): Goal {
  return {
    id: "goal-1",
    title: "Read every day",
    guidingVerseId: "2_47",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("goals storage", () => {
  it("starts empty", async () => {
    expect(await getGoals()).toEqual([]);
  });

  it("adds a goal and persists it", async () => {
    const goal = makeGoal();
    await addGoal(goal);
    expect(await getGoals()).toEqual([goal]);
  });

  it("deletes a goal by id", async () => {
    const goal = makeGoal();
    await addGoal(goal);
    await deleteGoal(goal.id);
    expect(await getGoals()).toEqual([]);
  });
});
