import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "calendar-date": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { value?: string },
        HTMLElement
      >;
      "calendar-month": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
