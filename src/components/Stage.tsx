import { FC } from "react";

import { Stage as Stg } from "../Utils/Interfaces";
import Dropdown from "./Dropdown";

interface Props {
    stage: Stg;
}

const Stage: FC<Props> = ({ stage }) => {
    const background = require(`../stages/${stage.bg_img.name}`);

    return (
        <div>
            <img
                src={background}
                alt="background image"
                className="background_image"
            />

            <Dropdown stage={stage} />
        </div>
    );
};

export default Stage;
