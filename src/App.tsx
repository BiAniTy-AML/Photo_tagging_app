import { FC, useState } from "react";
import "./css/styles.css";

import Cursor from "./components/Cursor";
import Marker from "./components/Marker";
import Dropdown from "./components/Dropdown";
import Stage from "./components/Stage";

import { StagesInterface } from "./Utils/Interfaces";

const App: FC = () => {
    const stages: StagesInterface = {
        1: {
            characters: ["char1", "char2", "char3"],
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
            <Marker />

            <Stage stage={current_stage} />
        </>
    );
};

export default App;
