import { Comment, CommentTreeType } from "src/types";

import { REPLY_STYLE_COLORS, REPLY_STYLE_COLORS_LENGTH } from "../constants";

export const getReplyStyleColor = (replyStyle: number) => {
  return REPLY_STYLE_COLORS[replyStyle % REPLY_STYLE_COLORS_LENGTH];
};

export const buildFlatCommentsTree = (
  flatComments: Comment[],
): CommentTreeType[] => {
  const replyStyleCounters = new Map<number, number>();
  const map = new Map<number, CommentTreeType>();
  const roots: CommentTreeType[] = [];

  const mappedComments: CommentTreeType[] = flatComments.map((comment) => ({
    ...(comment as Comment),
    children: [],
    replyStyle: 0,
  }));

  mappedComments.forEach((comment) => {
    map.set(comment.id, comment);
  });

  mappedComments.forEach((comment) => {
    const parentId = comment.parentCommentId;

    if (!parentId) {
      roots.push(map.get(comment.id)!);
    } else {
      const topAncestor = findTopLevelAncestor(comment, map);
      const current = map.get(comment.id);

      if (topAncestor && current) {
        topAncestor.children.push(current);

        if (parentId === topAncestor.id) {
          if (!replyStyleCounters.has(topAncestor.id)) {
            replyStyleCounters.set(topAncestor.id, 1);
          }

          const style = replyStyleCounters.get(topAncestor.id)!;
          current.replyStyle = style;
          replyStyleCounters.set(topAncestor.id, style + 1);
        } else {
          const parent = map.get(parentId);
          if (parent) {
            current.replyStyle = parent.replyStyle;
          }
        }
      }
    }
  });

  return sortChildsByReplyStyle(roots);
};

const sortChildsByReplyStyle = (roots: CommentTreeType[]) => {
  return roots.map((root) => ({
    ...root,
    children: root.children.sort((childA, childB) =>
      childA.replyStyle - childB.replyStyle
    ),
  }));
};

function findTopLevelAncestor(
  comment: Comment,
  map: Map<number, CommentTreeType>,
): CommentTreeType | null {
  let current = comment;
  while (current.parentCommentId) {
    const parent = map.get(current.parentCommentId);
    if (!parent) break;
    current = parent;
  }
  return map.get(current.id) || null;
}
