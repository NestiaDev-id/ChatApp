import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p className="text-red-500">hello</p>
      <button className="btn">Button</button>
    </div>
  );
}

export default App;
