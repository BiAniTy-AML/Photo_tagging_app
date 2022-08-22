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
                {
                    name: "Waldo",
                    image: "target1.png",
                    answers: {
                        min_x: 775,
                        max_x: 856,
                        min_y: 187,
                        max_y: 253,
                    },
                    found: false,
                },
                {
                    name: "Master Chief",
                    image: "target2.png",
                    answers: {
                        min_x: 716,
                        max_x: 790,
                        min_y: 107,
                        max_y: 203,
                    },
                    found: false,
                },
                {
                    name: "Luffy",
                    image: "target3.png",
                    answers: {
                        min_x: 400,
                        max_x: 474,
                        min_y: 664,
                        max_y: 739,
                    },
                    found: false,
                },
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

            <Stage
                stage={current_stage}
                set_current_state={set_current_stage}
            />
        </>
    );
};

export default App;
