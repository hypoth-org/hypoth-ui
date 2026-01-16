/**
 * FileUpload Input component - hidden file input element.
 */

import { type ChangeEvent, type InputHTMLAttributes, forwardRef, useCallback } from "react";
import { useFileUploadContext } from "./file-upload-context.js";

export interface FileUploadInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {}

/**
 * Hidden file input element that handles file selection.
 * Must be rendered within FileUpload.Root.
 *
 * @example
 * ```tsx
 * <FileUpload.Root>
 *   <FileUpload.Input />
 *   <FileUpload.Dropzone>...</FileUpload.Dropzone>
 * </FileUpload.Root>
 * ```
 */
export const FileUploadInput = forwardRef<HTMLInputElement, FileUploadInputProps>(
  ({ className, style, ...restProps }, ref) => {
    const { behavior, inputRef, disabled } = useFileUploadContext("FileUpload.Input");

    const inputProps = behavior.getInputProps();

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target;
        if (input.files && input.files.length > 0) {
          behavior.addFiles(input.files);
          // Reset input so the same file can be selected again
          input.value = "";
        }
      },
      [behavior]
    );

    // Merge refs
    const mergedRef = useCallback(
      (element: HTMLInputElement | null) => {
        (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = element;
        if (typeof ref === "function") {
          ref(element);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = element;
        }
      },
      [inputRef, ref]
    );

    // Default hidden styles
    const hiddenStyles: React.CSSProperties = {
      position: "absolute",
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      border: 0,
      ...style,
    };

    return (
      <input
        ref={mergedRef}
        type={inputProps.type}
        accept={inputProps.accept}
        multiple={inputProps.multiple}
        disabled={disabled || inputProps.disabled}
        aria-hidden={inputProps["aria-hidden"]}
        tabIndex={inputProps.tabIndex}
        className={className}
        style={hiddenStyles}
        onChange={handleChange}
        {...restProps}
      />
    );
  }
);

FileUploadInput.displayName = "FileUpload.Input";
