import MathsPractice from "@/components/maths-slow/MathsPractice";

export default function Addition() {
  return (
    <MathsPractice
      operation="addition"
      background={require("../../assets/images/maths-slow/additionbackground.png")}
    />
  );
}