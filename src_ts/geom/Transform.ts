class Transform {
    //--------------------------- WorldTransform -----------------------------
    //
    // given a List of 2D vectors, a position and orientation
    // forward and side should be normalised before calling this method
    // this function transforms the 2D vectors into the object's world space
    //------------------------------------------------------------------------

    static worldTransform(points: Array<Vector2D>,
        pos: Vector2D, forward: Vector2D, side: Vector2D,
        scale: Vector2D = Vector2D.ONE): Array<Vector2D> {

        // create a transformation matrix
        let matTransform = new Matrix2D();
        // scale
        if ((scale.x != 1.0) || (scale.y != 1.0)) matTransform.scale(scale.x, scale.y);
        // rotate
        matTransform.rotate(forward, side);
        // and translate
        matTransform.translate(pos.x, pos.y);

        //now transform the object's vertices
        return matTransform.transformVectors(points);
    }

    //--------------------- PointToWorldSpace --------------------------------
    // AgentHeading and AgentSide should be normalised first
    // Transforms a point from the agent's local space into world space
    //------------------------------------------------------------------------
    static pointToWorldSpace(point: Vector2D,
        AgentHeading: Vector2D,
        AgentSide: Vector2D,
        AgentPosition: Vector2D): Vector2D {

        //create a transformation matrix
        let matTransform = new Matrix2D();
        //rotate
        matTransform.rotate(AgentHeading, AgentSide);
        //and translate
        matTransform.translate(AgentPosition.x, AgentPosition.y);

        //now transform the vertices
        return matTransform.transformVector(point);
    }


    //--------------------- VectorToWorldSpace -------------------------------
    // Transforms a vector from the agent's local space into world space
    //------------------------------------------------------------------------
    static vectorToWorldSpace(vec: Vector2D,
        AgentHeading: Vector2D,
        AgentSide: Vector2D): Vector2D {

        // create a transformation matrix
        let matTransform = new Matrix2D();
        // rotate
        matTransform.rotate(AgentHeading, AgentSide);

        // now transform and return the vertices
        return matTransform.transformVector(vec);
    }


    //--------------------- PointToLocalSpace --------------------------------
    // agentHeading and agentSide should be normalised
    //------------------------------------------------------------------------
    public static pointToLocalSpace(point: Vector2D,
        AgentHeading: Vector2D,
        AgentSide: Vector2D,
        AgentPosition: Vector2D): Vector2D {

        // create a transformation matrix
        let matTransform = new Matrix2D();
        // initialize the transformation matrix
        let tx = -AgentPosition.dot(AgentHeading);
        let ty = -AgentPosition.dot(AgentSide);
        matTransform._11(AgentHeading.x); matTransform._12(AgentSide.x);
        matTransform._21(AgentHeading.y); matTransform._22(AgentSide.y);
        matTransform._31(tx); matTransform._32(ty);

        // now transform the vertices
        return matTransform.transformVector(point);
    }

    //--------------------- VectorToLocalSpace -------------------------------
    // AgentHeading and AgentSide should be normalised
    //------------------------------------------------------------------------
    public static vectorToLocalSpace(vec: Vector2D,
        AgentHeading: Vector2D,
        AgentSide: Vector2D): Vector2D {

        // create a transformation matrix
        let matTransform = new Matrix2D();
        // initialize the transformation matrix
        matTransform._11(AgentHeading.x); matTransform._12(AgentSide.x);
        matTransform._21(AgentHeading.y); matTransform._22(AgentSide.y);

        // now transform the vertices
        return matTransform.transformVector(vec);
    }

    //-------------------------- Vec2DRotateAroundOrigin --------------------------
    // v is unchanged
    // rotates a vector ang radians around the origin
    //-----------------------------------------------------------------------------
    public static vec2DRotateAroundOrigin(v: Vector2D, ang: number): Vector2D {
        // create a transformation matrix
        let mat = new Matrix2D();

        // initialize the rotation matrix
        mat.rotate(ang);

        //now transform the object's vertices
        return mat.transformVector(v);
    }

}
