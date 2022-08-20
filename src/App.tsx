import { FC, useState } from "react";
import "./css/styles.css";

import Cursor from "./components/Cursor";
import Stage from "./components/Stage";

import { StagesInterface } from "./Utils/Interfaces";

const App: FC = () => {
    const stages: StagesInterface = {
        1: {
            name: "stage1",
            targets: [
                { name: "Waldo", image: "target1.png" },
                { name: "Master Chief", image: "target2.png" },
                { name: "Luffy", image: "target3.png" },
            ],
            // src: https://pxlcon.jimmysomething.com/
            bg_img: {
                path: "../stages/",
                name: "stage1.jpg",
            },
        },
    };

    const [current_stage, set_current_stage] = useState(stages[1]);

    return (
        <>
            <Cursor />

            <Stage stage={current_stage} />
        </>
    );
};

export default App;
