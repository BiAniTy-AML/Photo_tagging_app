import {
    Dispatch,
    FC,
    RefObject,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";

import { ResultInfo } from "../Utils/Interfaces";

import { decide_position } from "../Utils/Utils";

interface Props {
    container: RefObject<HTMLDivElement>;
    image?: RefObject<HTMLImageElement>;
}

const ZoomDiv: FC<Props> = ({ container, image }) => {
    const lens = useRef<HTMLDivElement>(null);
    const result = useRef<HTMLDivElement>(null);

    const [cont_rect, set_cont_rect] = useState<DOMRect | null>(null);

    const [hidden, set_hidden] = useState(false);

    const [result_info, set_result_info] = useState<ResultInfo>({
        fx: 0,
        fy: 0,
        coordinates_lens: { x: 0, y: 0 },
    });

    let lens_rect: DOMRect;
    let res_rect: DOMRect;

    const get_ref_data = () => {
        lens_rect = lens.current!.getBoundingClientRect();
        res_rect = result.current!.getBoundingClientRect();

        set_cont_rect(container.current!.getBoundingClientRect());
    };

    const [lens_position, set_lens_position] = useState({ x: 0, y: 0 });
    const [result_position, set_result_position] = useState({ x: 0, y: 0 });

    const add_event_listeners = (): void => {
        document.addEventListener("mousemove", on_mouse_move);
        document.addEventListener("click", on_click);
    };

    const remove_event_listeners = (): void => {
        document.removeEventListener("mousemove", on_mouse_move);
        document.removeEventListener("click", on_click);
    };

    const position_divs = (
        e: MouseEvent
    ): { lens: { x: number; y: number }; res: { x: number; y: number } } => {
        const coord_lens = decide_position({
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

        const coord_result = decide_position({
            e,
            parent: container.current!,
            actual_div: result.current!,
            when_out: "change",
            offset_x: 200,
            offset_y: -200,
        });

        return {
            lens: coord_lens,
            res: coord_result,
        };
    };

    let select_click = true;

    const on_click = (e: MouseEvent) => {
        if (select_click) {
            document.removeEventListener("mousemove", on_mouse_move);

            set_hidden(true);
            select_click = false;
            return;
        }

        document.addEventListener("mousemove", on_mouse_move);

        set_hidden(false);
        select_click = true;

        const positions = position_divs(e);

        set_lens_position(positions.lens);
        set_result_position(positions.res);
    };

    useEffect(() => {
        add_event_listeners();
        get_ref_data();

        return () => remove_event_listeners();
    }, [result_info]);

    const on_mouse_move = (e: MouseEvent) => {
        const positions = position_divs(e);

        const coordinates_lens = positions.lens;
        let fx: number = res_rect.width / lens_rect.width;
        let fy: number = res_rect.height / lens_rect.height;

        const container_rect = container.current!.getBoundingClientRect();

        // * No matter what i do, cont_rec is always null
        // const cl = {
        //     x: coordinates_lens.x - (cont_rect!.left + window.scrollX),

        //     y: coordinates_lens.y - (cont_rect!.top + window.scrollY),
        // };

        // TODO: The result seems to be a few pixels off the lens
        const cl = {
            x: coordinates_lens.x - (container_rect.left + window.scrollX),
            y: coordinates_lens.y - (container_rect.top + window.scrollY),
        };

        const res: ResultInfo = {
            fx,
            fy,
            coordinates_lens: cl,
        };

        set_result_info(res);

        const coordinates_result = positions.res;

        set_lens_position(coordinates_lens);

        set_result_position(coordinates_result);
    };

    return (
        <>
            <div
                ref={result}
                style={{
                    top: result_position.y,
                    left: result_position.x,
                    backgroundImage: `url(${
                        image!.current ? image!.current.src : ""
                    })`,
                    backgroundSize: `${
                        cont_rect ? cont_rect.width * result_info.fx : 0
                    }px 
                    ${cont_rect ? cont_rect.height * result_info.fy : 0}px`,
                    backgroundPosition: `-${
                        result_info.coordinates_lens.x * result_info.fx
                    }px -${result_info.coordinates_lens.y * result_info.fy}px`,
                }}
                className={`zoom_result ${hidden ? "hidden" : ""}`}
            ></div>

            <div
                ref={lens}
                style={{
                    top: lens_position.y,
                    left: lens_position.x,
                }}
                className={`zoom_lens ${hidden ? "hidden" : ""}`}
            ></div>
        </>
    );
};

export default ZoomDiv;
