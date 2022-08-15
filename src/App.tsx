import { FC, useState } from "react";
import "./css/styles.css";

import Cursor from "./components/Cursor";
import Marker from "./components/Marker";
import Dropdown from "./components/Dropdown";

interface StagesInterface {
    1: {
        characters: string[];
        bg_img: {
            path: string;
            name: string;
        };
    };
}

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

    return (
        <>
            <Cursor />
            <Marker />
            <Dropdown stage={stages[1]} />
        </>
    );
};

export default App;
