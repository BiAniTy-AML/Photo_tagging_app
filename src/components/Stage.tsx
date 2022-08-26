import { Dispatch, FC, SetStateAction, useRef, useState } from "react";

import { Stage as Stg } from "../Utils/Interfaces";
import Dropdown from "./Dropdown";
import ZoomDiv from "./ZoomDiv";
import Marker from "../components/Marker";

interface Props {
    stage: Stg;
    set_current_state: Dispatch<SetStateAction<Stg>>;
}

const Stage: FC<Props> = ({ stage, set_current_state }) => {
    // The background image and its DOM element
    const background = require(`../images/stages/${stage.name}/${stage.bg_img.name}`);
    const bg_image = useRef<any>(null);

    // The backgound image container
    const container = useRef<HTMLDivElement>(null);

    // Whether the lens and result should be displayed
    const [visible, set_visible] = useState(true);

    // The top bar element
    const top_bar = useRef<HTMLDivElement>(null);

    return (
        <div className="main_content">
            <div className="top_bar" ref={top_bar}>
                <div className="challenge">
                    <p className="">Find them!</p>
                    <div className="options">
                        <button
                            className={`toggle_lens ${visible ? "on" : "off"}`}
                            onClick={() => set_visible(!visible)}
                        >
                            Lens
                        </button>
                    </div>
                </div>
                <div className="targets">
                    {stage.targets.map((target, i) => {
                        const image = require(`../images/stages/${stage.name}/${target.image}`);

                        return (
                            <div className="target" key={`${target.found}${i}`}>
                                <img
                                    src={image}
                                    alt=""
                                    style={{ width: 100, height: 100 }}
                                />
                                <div
                                    className={`name ${
                                        target.found ? "found" : ""
                                    }`}
                                >
                                    {target.name}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg_container zoom_container" ref={container}>
                <img
                    src={background}
                    alt="background"
                    className="background_image"
                    ref={bg_image}
                />
                {visible ? (
                    <ZoomDiv container={container} image={bg_image} />
                ) : (
                    <></>
                )}
            </div>

            <Dropdown
                stage={stage}
                top_bar={top_bar}
                container={container}
                set_current_state={set_current_state}
            />

            <Marker top_bar={top_bar} />
        </div>
    );
};

export default Stage;
