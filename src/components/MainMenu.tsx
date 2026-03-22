import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

export interface ChallengeData {
	gridSize: number;
	city: "Bogota" | "Toulouse";
	targetColour: { name: string; hex: string; hint: string };
}

export function MainMenu() {
	const navigate = useNavigate();
	const [activeChallenge, setActiveChallenge] = useState<ChallengeData | null>(
		null,
	);

	useEffect(() => {
		const saved = localStorage.getItem("colorDate_challenge");
		if (saved) {
			try {
				setActiveChallenge(JSON.parse(saved));
			} catch (e) {
				console.error("Failed to parse challenge data", e);
			}
		}
	}, []);

	const handleNewChallenge = () => {
		localStorage.removeItem("colorDate_challenge");
		navigate("/setup");
	};

	const handleContinue = () => {
		navigate("/setup?resume=true");
	};

	return (
		<main className="min-h-[100svh] flex flex-col pt-safe pb-safe">
			<section className="flex-1 flex flex-col justify-between p-8 md:p-20">
				<div className="mt-20 md:mt-32 max-w-2xl">
					<h1 className="font-noto-serif text-5xl md:text-7xl leading-tight tracking-tight italic">
						Capture your city's hues, together.
					</h1>
				</div>

				<div className="mt-auto flex flex-col gap-3">
					{activeChallenge ? (
						<div className="flex flex-col gap-3">
							<button
								type="button"
								onClick={handleContinue}
								className="w-full min-h-[48px] px-12 py-5 bg-primary text-on-primary font-work-sans text-[10px] tracking-[0.2em] uppercase transition-all active:opacity-80"
							>
								OPEN CHALLENGE
							</button>
							<button
								type="button"
								onClick={handleNewChallenge}
								className="w-full min-h-[48px] px-12 py-5 border border-primary text-primary font-work-sans text-[10px] tracking-[0.2em] uppercase transition-all active:bg-surface-container-low"
							>
								NEW CHALLENGE
							</button>
						</div>
					) : (
						<button
							type="button"
							onClick={handleNewChallenge}
							className="w-full min-h-[48px] md:w-auto px-12 py-5 bg-primary text-on-primary font-work-sans text-[10px] tracking-[0.2em] uppercase transition-all active:opacity-80"
						>
							START CHALLENGE
						</button>
					)}
				</div>
			</section>
		</main>
	);
}
