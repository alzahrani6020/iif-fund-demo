"""Small local example for AfaqLearningAgent. No network calls are made."""

from .aic_agent import AfaqLearningAgent, AgentContext, AgentTask, Evaluation
from .aic_memory_service import MemoryService


def demo() -> None:
    memory = MemoryService()

    def executor(task, recalled):
        return {
            "message": f"Executed: {task.instruction}",
            "recalled": len(recalled),
        }

    def evaluator(task, output):
        return Evaluation(success=True, score=0.9, reason="demo execution completed")

    def reflector(task, output, evaluation):
        return {
            "lesson": "Preserve useful context and evaluate every run before learning.",
            "applies_to": task.instruction,
        }

    agent = AfaqLearningAgent(
        memory=memory,
        executor=executor,
        evaluator=evaluator,
        reflector=reflector,
    )

    task = AgentTask(
        instruction="Review an admin workflow",
        context=AgentContext(tenant_id="afaq", project_id="afaq-creative"),
    )
    run = agent.run(task)
    print(run)


if __name__ == "__main__":
    demo()
