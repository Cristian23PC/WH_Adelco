import { Switch, TextArea } from '@adelco/web-components';
import Card from './Card';

const MAX_LENGTH = 140;

const Comment = ({ setAddComment, addComment, setComment, comment }) => {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold">Añadir un comentario</h4>
          <p className="text-xs">(se incluirá en la factura)</p>
        </div>
        <div>
          <Switch
            onChange={() => setAddComment(!addComment)}
            checked={addComment}
          />
        </div>
      </div>
      {addComment && (
        <div className="mt-6">
          <TextArea
            onChange={(e) => {
              if (e.target.value.length <= MAX_LENGTH) {
                setComment(e.target.value);
              }
            }}
            value={comment}
            maxLength={MAX_LENGTH}
            variant={comment.length >= MAX_LENGTH ? 'failure' : 'none'}
          />
        </div>
      )}
    </Card>
  );
};

export default Comment;
