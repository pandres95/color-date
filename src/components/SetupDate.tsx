import { useEffect, useState } from "react";

import type { ChallengeData } from "./MainMenu";
import { Instructions } from "./Instructions";
import { StepLayoutSize } from "./setup/StepLayoutSize";
import { StepLocation } from "./setup/StepLocation";
import { StepTargetHue } from "./setup/StepTargetHue";
import { useSearchParams } from "react-router-dom";

type City = "Bogota" | "Toulouse";

export function SetupDate() {
	const [searchParams] = useSearchParams();

	// Single Source of Truth for Flow State
	const [step, setStep] = useState(1);
	const [gridSize, setGridSize] = useState<number>(2);
	const [city, setCity] = useState<City>("Bogota");
	const [targetColour, setTargetColour] = useState<{
		name: string;
		hex: string;
		hint: string;
	} | null>(null);

	// Resume active challenge if requested
	useEffect(() => {
		if (searchParams.get("resume") === "true") {
			const saved = localStorage.getItem("colorDate_challenge");
			if (saved) {
				const data: ChallengeData = JSON.parse(saved);
				setGridSize(data.gridSize);
				setCity(data.city);
				setTargetColour(data.targetColour);
				setStep(4); // Jump straight to instructions
			}
		}
	}, [searchParams]);

	const advanceStep = () => {
		if (step === 3 && targetColour) {
			// Save full sequence to persistence!
			const data: ChallengeData = { gridSize, city, targetColour };
			localStorage.setItem("colorDate_challenge", JSON.stringify(data));
			setStep(4);
		} else {
			setStep((s) => Math.min(s + 1, 4));
		}
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Main Return acts as a State Machine Container
	return (
		<>
			<div className="fixed top-0 left-0 w-full z-50 pointer-events-none"></div>

			{step === 1 && (
				<StepLayoutSize setGridSize={setGridSize} onNext={advanceStep} />
			)}

			{step === 2 && <StepLocation setCity={setCity} onNext={advanceStep} />}

			{step === 3 && (
				<StepTargetHue
					city={city}
					targetColour={targetColour}
					setTargetColour={setTargetColour}
					onAccept={advanceStep}
				/>
			)}

			{step === 4 && <Instructions targetColour={targetColour} gridSize={gridSize} />}
		</>
	);
}
