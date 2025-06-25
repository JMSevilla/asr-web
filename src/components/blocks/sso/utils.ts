import { PageContentValues } from "../../../api/content/types/page";

export const findBlockByKey = (contents: PageContentValues[], key: string) =>
  contents.find(content => content?.elements?.formKey?.value === key || content?.type === key);
