export default function Timer({ timeLeft }) {
    return (
      <p className="text-white text-lg mt-2">
        You can claim a coupon in {Math.floor(timeLeft / 60)}m {timeLeft % 60}s.
      </p>
    );
  }
  