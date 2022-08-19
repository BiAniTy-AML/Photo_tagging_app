import { FC, useRef } from "react";

import { Stage as Stg } from "../Utils/Interfaces";
import Dropdown from "./Dropdown";
import ZoomDiv from "./ZoomDiv";

interface Props {
    stage: Stg;
}

const Stage: FC<Props> = ({ stage }) => {
    const background = require(`../images/stages/${stage.name}/${stage.bg_img.name}`);
    const bg_image = useRef<any>(null);
    const container = useRef<HTMLDivElement>(null);

    return (
        <div className="main_content">
            <div className="top_bar">
                <div className="challenge">Find them!</div>
                <div className="targets">
                    {stage.targets.map((target, i) => {
                        const image = require(`../images/stages/${stage.name}/${target.image}`);
                        return (
                            <div className="target" key={i}>
                                <img
                                    src={image}
                                    alt=""
                                    style={{ width: 100, height: 100 }}
                                />
                                <div className="name">{target.name}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg_container zoom_container" ref={container}>
                <img
                    src={background}
                    alt="background image"
                    className="background_image"
                    ref={bg_image}
                />
                <ZoomDiv container={container} image={bg_image} />
            </div>

            <Dropdown stage={stage} />
        </div>
    );
};

export default Stage;
