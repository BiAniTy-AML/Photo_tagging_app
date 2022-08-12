import { FC, useState } from "react";
import "./css/styles.css";

import Cursor from "./components/Cursor";
import Marker from "./components/Marker";
import Dropdown from "./components/Dropdown";

interface StagesInterface {
    1: {
        characters: string[];
    };
}

const App: FC = () => {
    const stages: StagesInterface = {
        1: {
            characters: [],
        },
    };

    return (
        <>
            <Cursor />
            <Marker />
            <Dropdown />
        </>
    );
};

export default App;
