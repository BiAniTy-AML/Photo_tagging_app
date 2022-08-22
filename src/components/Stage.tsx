import {
    Dispatch,
    FC,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";

import { Stage as Stg } from "../Utils/Interfaces";
import Dropdown from "./Dropdown";
import ZoomDiv from "./ZoomDiv";
import Marker from "../components/Marker";

interface Props {
    stage: Stg;
    set_current_state: Dispatch<SetStateAction<Stg>>;
}

const Stage: FC<Props> = ({ stage, set_current_state }) => {
    const background = require(`../images/stages/${stage.name}/${stage.bg_img.name}`);
    const bg_image = useRef<any>(null);
    const container = useRef<HTMLDivElement>(null);

    const [visible, set_visible] = useState(true);
    const top_bar = useRef<HTMLDivElement>(null);

    const [internal_state, set_internal_state] = useState(stage);
    const [previous_value, set_previous_value] = useState<Stg | null>(null);

    if (stage !== previous_value) {
        set_internal_state(stage);
        set_previous_value(stage);
    }

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
                    {internal_state.targets.map((target, i) => {
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
                    alt="background image"
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
