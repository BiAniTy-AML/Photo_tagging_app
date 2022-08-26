import { FC, RefObject, useEffect, useRef, useState } from 'react';

import { ResultInfo } from '../Utils/Interfaces';

import { decide_position } from '../Utils/Utils';

interface Props {
    container: RefObject<HTMLDivElement>;
    image?: RefObject<HTMLImageElement>;
}

const ZoomDiv: FC<Props> = ({ container, image }) => {
    // The lens and the amplified image div(result)
    const lens = useRef<HTMLDivElement>(null);
    const result = useRef<HTMLDivElement>(null);

    // The container info
    const [cont_rect, set_cont_rect] = useState<DOMRect | null>(null);

    // If lens and result should be showing
    const [hidden, set_hidden] = useState(false);

    // Information used to make the result div amplify what is inside the lens
    const [result_info, set_result_info] = useState<ResultInfo>({
        fx: 0,
        fy: 0,
        coordinates_lens: {
            x: 0,
            y: 0,
        },
    });

    let lens_rect: DOMRect;
    let res_rect: DOMRect;

    // Set ref data after the component mounts
    const get_ref_data = () => {
        lens_rect = lens.current!.getBoundingClientRect();
        res_rect = result.current!.getBoundingClientRect();

        // ! not working

        set_cont_rect(container.current!.getBoundingClientRect());
    };

    // Position of both divs
    const [lens_position, set_lens_position] = useState({
        x: 0,
        y: 0,
    });
    const [result_position, set_result_position] = useState({
        x: 0,
        y: 0,
    });

    const add_event_listeners = (): void => {
        document.addEventListener('mousemove', on_mouse_move);
        document.addEventListener('click', on_click);
    };

    const remove_event_listeners = (): void => {
        document.removeEventListener('mousemove', on_mouse_move);
        document.removeEventListener('click', on_click);
    };

    // Gets the postion the divs should be in
    const position_divs = (
        e: MouseEvent,
    ): {
        lens: {
            x: number;
            y: number;
        };
        res: {
            x: number;
            y: number;
        };
    } => {
        const coord_lens = decide_position({
            e,
            parent: container.current!,
            actual_div: lens.current!,
            when_out: 'stop',
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
            when_out: 'change',
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
        // !if user activates lens while dropdown is open, they get out of sync
        // Do nothing if the top bar is clicked
        if (
            e.pageY <=
            container.current!.getBoundingClientRect().top + window.scrollY
        )
            return;

        // If the user chooses a location on the image
        if (select_click && !hidden) {
            // Makes the divs disappear and stop them from moving
            // TODO: make a variable to decide whether the divs should move or not, instead of adding and removing the event
            document.removeEventListener('mousemove', on_mouse_move);

            set_hidden(true);
            select_click = false;
            return;
        }

        // Or if the user clicks while the dropdown is showing
        document.addEventListener('mousemove', on_mouse_move);

        // The divs appear again
        set_hidden(false);
        select_click = true;

        // Set their position
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

        // The size factor between the lens and the result
        let fx: number = res_rect.width / lens_rect.width;
        let fy: number = res_rect.height / lens_rect.height;

        const container_rect = container.current!.getBoundingClientRect();

        // ? No matter what i do, cont_rec is always null
        // const cl = {
        //     x: coordinates_lens.x - (cont_rect!.left + window.scrollX),

        //     y: coordinates_lens.y - (cont_rect!.top + window.scrollY),
        // };

        // TODO: The result seems to be a few pixels off the lens
        // The coords of the lens relative to the image
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
                    display: `${result_position.y ? '' : 'none'}`,
                    top: result_position.y,
                    left: result_position.x,
                    backgroundImage: `url(${
                        image!.current ? image!.current.src : ''
                    })`,
                    backgroundSize: `${
                        cont_rect ? cont_rect.width * result_info.fx : 0
                    }px 
                    ${cont_rect ? cont_rect.height * result_info.fy : 0}px`,
                    backgroundPosition: `-${
                        result_info.coordinates_lens.x * result_info.fx
                    }px -${result_info.coordinates_lens.y * result_info.fy}px`,
                }}
                className={`zoom_result ${hidden ? 'hidden' : ''}`}
            ></div>

            <div
                ref={lens}
                style={{
                    display: `${lens_position.y ? '' : 'none'}`,
                    top: lens_position.y,
                    left: lens_position.x,
                }}
                className={`zoom_lens ${hidden ? 'hidden' : ''}`}
            ></div>
        </>
    );
};

export default ZoomDiv;
