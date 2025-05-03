import { CommentFromDbType, CommentTreeType } from "src/types";

const REPLY_STYLE_COLORS: Record<number, string> = {
  0: "bg-gray-600/5 border-gray-300/20",
  1: "bg-purple-600/5 border-purple-400/20",
  2: "bg-pink-600/5 border-pink-400/20",
  3: "bg-yellow-600/5 border-yellow-400/20",
  4: "bg-blue-600/5 border-blue-400/20",
  5: "bg-emerald-600/5 border-emerald-400/20",
  6: "bg-indigo-600/5 border-indigo-400/20",
};

const replyStyleColorsLength = Object.keys(REPLY_STYLE_COLORS).length;

export const getReplyStyleColor = (replyStyle: number) => {
  return REPLY_STYLE_COLORS[replyStyle % replyStyleColorsLength];
};

export const buildFlatCommentsTree = (
  flatComments: CommentFromDbType[],
): CommentTreeType[] => {
  const replyStyleCounters = new Map<number, number>();
  const map = new Map<number, CommentTreeType>();
  const roots: CommentTreeType[] = [];

  const mappedComments: CommentTreeType[] = flatComments.map((comment) => ({
    ...(comment as CommentFromDbType),
    children: [],
    replyStyle: 0,
  }));

  mappedComments.forEach((comment) => {
    map.set(comment.id, comment);
  });

  mappedComments.forEach((comment) => {
    const parentId = comment.parent_comment_id;

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
  comment: CommentFromDbType,
  map: Map<number, CommentTreeType>,
): CommentTreeType | null {
  let current = comment;
  while (current.parent_comment_id) {
    const parent = map.get(current.parent_comment_id);
    if (!parent) break;
    current = parent;
  }
  return map.get(current.id) || null;
}
