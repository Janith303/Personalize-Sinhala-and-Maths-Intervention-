import MathsPractice from "@/components/maths-slow/MathsPractice";

export default function Multiplication() {
  return (
    <MathsPractice
      operation="multiplication"
      background={require("../../assets/images/maths-slow/multiplicationbackground.png")}
    />
  );
}