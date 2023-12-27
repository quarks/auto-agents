class Transform {
    //--------------------------- WorldTransform -----------------------------
    //
    // given a List of 2D vectors, a position and orientation
    // forward and side should be normalised before calling this method
    // this function transforms the 2D vectors into the object's world space
    //------------------------------------------------------------------------
    static worldTransform(points, pos, forward, side, scale = Vector2D.ONE) {
        //create a transformation matrix
        let matTransform = new Matrix2D();
        //scale
        if ((scale.x != 1.0) || (scale.y != 1.0))
            matTransform.scale(scale.x, scale.y);
        //rotate
        matTransform.rotate(forward, side);
        //and translate
        matTransform.translate(pos.x, pos.y);
        //now transform the object's vertices
        return matTransform.transformVectors(points);
    }
    //--------------------- PointToWorldSpace --------------------------------
    // agentHeading and agentSide should be normalised first
    // Transforms a point from the agent's local space into world space
    //------------------------------------------------------------------------
    static pointToWorldSpace(point, AgentHeading, AgentSide, AgentPosition) {
        //create a transformation matrix
        let matTransform = new Matrix2D();
        //rotate
        matTransform.rotate(AgentHeading, AgentSide);
        //matTransform.rotate(Vector2D.normalize(AgentHeading), Vector2D.normalize(AgentSide));
        //and translate
        matTransform.translate(AgentPosition.x, AgentPosition.y);
        //now transform the vertices
        return matTransform.transformVector(point);
    }
    //--------------------- VectorToWorldSpace --------------------------------
    //
    //Transforms a vector from the agent's local space into world space
    //------------------------------------------------------------------------
    static vectorToWorldSpace(vec, AgentHeading, AgentSide) {
        //create a transformation matrix
        let matTransform = new Matrix2D();
        //rotate
        matTransform.rotate(AgentHeading, AgentSide);
        //now transform and return the vertices
        return matTransform.transformVector(vec);
    }
    //--------------------- PointToLocalSpace --------------------------------
    // agentHeading and agentSide should be normalised
    //------------------------------------------------------------------------
    static pointToLocalSpace(point, agentHeading, agentSide, agentPosition) {
        //create a transformation matrix
        let matTransform = new Matrix2D();
        let tx = -agentPosition.dot(agentHeading);
        let ty = -agentPosition.dot(agentSide);
        //create the transformation matrix
        matTransform._11(agentHeading.x);
        matTransform._12(agentSide.x);
        matTransform._21(agentHeading.y);
        matTransform._22(agentSide.y);
        matTransform._31(tx);
        matTransform._32(ty);
        //now transform the vertices
        return matTransform.transformVector(point);
    }
    //--------------------- VectorToLocalSpace --------------------------------
    //
    //------------------------------------------------------------------------
    static vectorToLocalSpace(vec, AgentHeading, AgentSide) {
        //create a transformation matrix
        let matTransform = new Matrix2D();
        //create the transformation matrix
        matTransform._11(AgentHeading.x);
        matTransform._12(AgentSide.x);
        matTransform._21(AgentHeading.y);
        matTransform._22(AgentSide.y);
        //now transform the vertices
        return matTransform.transformVector(vec);
    }
    //-------------------------- Vec2DRotateAroundOrigin --------------------------
    // v is unchanged
    // rotates a vector ang radians around the origin
    //-----------------------------------------------------------------------------
    static vec2DRotateAroundOrigin(v, ang) {
        //create a transformation matrix
        let mat = new Matrix2D();
        //rotate
        mat.rotate(ang);
        //now transform the object's vertices
        return mat.transformVector(v);
    }
}
//# sourceMappingURL=transform.js.map