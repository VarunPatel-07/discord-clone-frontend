import React from "react";

const App = () => {
  const cards = [
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
    "Card 1",
    "Card 2",
  ];

  return (
    <div
      className="grid gap-4 p-4 h-screen pt-[60px] "
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gridAutoRows: "minmax(150px, 1fr)",
      }}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {card}
        </div>
      ))}
    </div>
  );
};

export default App;
