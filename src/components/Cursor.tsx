import React, { FC, useEffect, useRef, useState } from "react";

interface Props {}

const Cursor: FC<Props> = () => {
    const cursor = useRef<HTMLDivElement>(null);
    const [hidden, set_hidden] = useState(false);

    const [position, set_position] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        add_event_listeners();

        return () => remove_event_listeners();
    }, []);

    const add_event_listeners = () => {
        document.addEventListener("mousemove", on_mouse_move);
        document.addEventListener("mouseenter", on_mouse_enter);
        document.addEventListener("mouseleave", on_mouse_leave);
    };

    const remove_event_listeners = () => {
        document.removeEventListener("mousemove", on_mouse_move);
        document.body.removeEventListener("mouseenter", on_mouse_enter);
        document.body.removeEventListener("mouseleave", on_mouse_leave);
    };

    const on_mouse_move = (e: MouseEvent): void => {
        set_position({ x: e.clientX, y: e.clientY });

        if (e.pageY - document.documentElement.scrollTop <= 10)
            set_hidden(true);
        else set_hidden(false);
    };

    const on_mouse_leave = (e: MouseEvent) => {
        // Checks if the cursor is out of the page
        if (e.pageY - document.documentElement.scrollTop <= 1) set_hidden(true);
    };

    const on_mouse_enter = () => {
        set_hidden(false);
    };

    return (
        <>
            <div
                className={`cursor ${hidden ? "hidden" : ""}`}
                ref={cursor}
                style={{ left: position.x, top: position.y }}
            ></div>
        </>
    );
};

export default Cursor;
