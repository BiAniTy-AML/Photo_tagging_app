import { DecidePositions } from '../Utils/Interfaces';

// Determines the position of the div following the mouse inside a parent
const decide_position = ({
    e,
    // The div following the mouse and its parent
    parent,
    actual_div,

    // How far from the mouse the div is
    offset_x = 0,
    offset_y = 0,

    // What to do when mouse is out of the parent
    when_out = 'nothing',

    // If you want to toggle a variable when the mouse leaves the parent
    toggle_on_leave_parent,
}: DecidePositions<boolean>): { x: number; y: number } => {
    // DOM info about the parent and the div
    const parent_rect = parent.getBoundingClientRect();
    const div_rect = actual_div?.getBoundingClientRect();

    if (!div_rect || !parent_rect) return { x: 0, y: 0 };

    // Data from toggle_on_leave_parent
    // Wanted to use destructuring, but was not able to
    let variable = toggle_on_leave_parent?.variable;
    const from = toggle_on_leave_parent?.from;
    const to = toggle_on_leave_parent?.to;
    const set_variable_fn = toggle_on_leave_parent?.set_variable_fn;

    let x = 0;
    let y = 0;

    // The boudaries in each axis the div is allowed to be in
    const min_x: number = parent_rect.left + window.scrollX;
    const min_y: number = parent_rect.top + window.scrollY;

    let max_x: number;
    let max_y: number;

    // Positions the div in the center of the mouse
    x = e.pageX + offset_x - div_rect.width / 2;
    y = e.pageY + offset_y - div_rect.height / 2;

    if (when_out === 'change') {
        // The max are the border of the parent
        max_x = parent_rect.right + window.scrollX;
        max_y = parent_rect.bottom + window.scrollY;

        // Offset independent on direction,
        // for dealing with negative values
        const abs_offx = Math.abs(offset_x);
        const abs_offy = Math.abs(offset_y);

        // Checks if the "dropdown" will appear too close to the end of the screen

        // Calculates the distance between the left border of the div
        // and the left border of the parent
        if (e.pageX - (div_rect.width / 2 + -offset_x) <= min_x) {
            // If it is too far left(less than the left border)

            // If the absolute offset value is between
            if (abs_offx < div_rect.width / 2 && abs_offx >= 0) {
                x = e.pageX;
            } else if (abs_offx >= div_rect.width / 2) {
                x = e.pageX - (offset_x + div_rect.width / 2);
            }

            y = y;
        }

        // If it is too far right
        if (e.pageX + (div_rect.width / 2 + offset_x) >= max_x) {
            if (abs_offx < div_rect.width / 2 && abs_offx >= 0) {
                x = e.pageX - div_rect.width;
            } else if (abs_offx >= div_rect.width / 2) {
                x = e.pageX - (offset_x + div_rect.width / 2);
            }

            y = y;
        }

        // Too far up
        if (e.pageY - (div_rect.width / 2 + -offset_y) <= min_y) {
            if (abs_offy < div_rect.width / 2 && abs_offy >= 0) {
                y = e.pageY;
            } else if (abs_offy >= div_rect.width / 2) {
                y = e.pageY - (offset_y + div_rect.width / 2);
            }

            x = x;
        }

        // Or too far down
        if (e.pageY + (div_rect.width / 2 + offset_y) >= max_y) {
            if (abs_offy < div_rect.width / 2 && abs_offy >= 0) {
                y = e.pageY - div_rect.width;
            } else if (abs_offy >= div_rect.width / 2) {
                y = e.pageY - (offset_y + div_rect.width / 2);
            }

            x = x;
        }
    } else {
        // The limits now are the the parent's border, but it also accounts for
        // the width of the element
        max_x = parent_rect.right - div_rect.width + window.scrollX;
        max_y = parent_rect.bottom - div_rect.height + window.scrollY;

        // Toggles the given variable
        if (set_variable_fn && from !== undefined) set_variable_fn(from);

        // Too far left
        if (x <= min_x) {
            x = min_x;
            y = y;
        }

        // Too far right
        if (x >= max_x) {
            x = max_x;
            y = y;
        }

        // Too high
        if (y <= min_y) {
            x = x;
            y = min_y;
        }

        // Too Low
        if (y >= max_y) {
            x = x;
            y = max_y;
        }

        // If the cursor goes above or below the parent
        if (
            e.pageY <= min_y ||
            e.pageY >= parent_rect.bottom + window.scrollY
        ) {
            if (set_variable_fn && to) set_variable_fn(to);
        }
    }

    return { x, y };
};

export { decide_position };
