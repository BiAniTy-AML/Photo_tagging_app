import { FC, RefObject, useEffect, useRef, useState } from "react";
import { decide_position } from "../Utils/Utils";

interface Props {
    container: RefObject<HTMLDivElement>;
    // image?: RefObject<HTMLImageElement>;
    image: any;
}

const ZoomDiv: FC<Props> = ({ container, image }) => {
    const lens = useRef<HTMLDivElement>(null);
    const result = useRef<HTMLDivElement>(null);

    const [hidden, set_hidden] = useState(false);

    let lens_rect: DOMRect;
    let res_rect: DOMRect;
    let cont_rect: DOMRect;

    const get_ref_data = () => {
        lens_rect = lens.current!.getBoundingClientRect();
        res_rect = result.current!.getBoundingClientRect();
        cont_rect = container.current!.getBoundingClientRect();
    };

    const [lens_position, set_lens_position] = useState({ x: 0, y: 0 });
    const [result_position, set_result_position] = useState({ x: 0, y: 0 });

    const add_event_listeners = (): void => {
        document.addEventListener("mousemove", on_mouse_move);
    };
    const remove_event_listeners = (): void => {
        document.addEventListener("mousemove", on_mouse_move);
    };

    useEffect(() => {
        add_event_listeners();
        get_ref_data();

        return () => remove_event_listeners();
    }, []);

    const on_mouse_move = (e: MouseEvent) => {
        const coordinates_lens = decide_position({
            e,
            parent: container.current!,
            actual_div: lens.current!,
            when_out: "stop",
            toggle_on_leave_parent: {
                from: false,
                to: true,
                set_variable_fn: set_hidden,
            },
        });

        const coordinates_result = decide_position({
            e,
            parent: container.current!,
            actual_div: result.current!,
            when_out: "change",
            offset_x: 200,
            offset_y: -200,
        });

        set_lens_position(coordinates_lens);

        set_result_position(coordinates_result);

        let fx: number = res_rect.width / lens_rect.width;
        let fy: number = res_rect.height / lens_rect.height;

        // result.current!.setAttribute(
        //     "style",
        //     `background-image: url(${image!.current.src}); background-size: ${
        //         cont_rect.width * fx
        //     }px ${cont_rect.height * fy}px; background-position: -${
        //         coordinates_lens.x * fx
        //     }px -${coordinates_lens.y * fy}px`
        // );
    };

    return (
        <>
            <div
                ref={result}
                style={{ top: result_position.y, left: result_position.x }}
                className={`zoom_result ${hidden ? "hidden" : ""}`}
            ></div>

            <div
                ref={lens}
                style={{
                    top: lens_position.y,
                    left: lens_position.x,
                    // backgroundImage: image.current!.src,
                }}
                className={`zoom_lens ${hidden ? "hidden" : ""}`}
            ></div>
        </>
    );
};

export default ZoomDiv;
